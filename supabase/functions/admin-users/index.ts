import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.86.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UserWithProfile {
  id: string
  email: string
  full_name: string | null
  role: string | null
  is_active: boolean
  created_at: string
  last_login: string | null
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create client with user's JWT
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // Verify the requesting user is an admin
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    if (roleError || roleData?.role !== 'admin') {
      console.error('Role check failed:', roleError, roleData)
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    // Create admin client for privileged operations
    const adminClient = createClient(supabaseUrl, supabaseServiceKey)

    switch (req.method) {
      case 'GET': {
        // Get all users with their profiles and roles
        const roleFilter = url.searchParams.get('role')
        
        let query = adminClient
          .from('profiles')
          .select(`
            id,
            user_id,
            full_name,
            is_active,
            created_at,
            last_login
          `)
          .order('created_at', { ascending: false })

        const { data: profiles, error: profilesError } = await query

        if (profilesError) {
          console.error('Profiles fetch error:', profilesError)
          throw profilesError
        }

        // Get auth users for email
        const { data: authUsers, error: authUsersError } = await adminClient.auth.admin.listUsers()
        
        if (authUsersError) {
          console.error('Auth users fetch error:', authUsersError)
          throw authUsersError
        }

        // Get all roles
        const { data: roles, error: rolesError } = await adminClient
          .from('user_roles')
          .select('user_id, role')

        if (rolesError) {
          console.error('Roles fetch error:', rolesError)
          throw rolesError
        }

        // Merge data
        const users: UserWithProfile[] = profiles?.map(profile => {
          const authUser = authUsers.users.find(u => u.id === profile.user_id)
          const userRole = roles?.find(r => r.user_id === profile.user_id)
          
          return {
            id: profile.user_id,
            email: authUser?.email || 'Unknown',
            full_name: profile.full_name,
            role: userRole?.role || null,
            is_active: profile.is_active,
            created_at: profile.created_at,
            last_login: profile.last_login
          }
        }) || []

        // Filter by role if specified
        const filteredUsers = roleFilter 
          ? users.filter(u => u.role === roleFilter)
          : users

        return new Response(
          JSON.stringify({ users: filteredUsers }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'PATCH': {
        const body = await req.json()
        const { userId, updates } = body

        if (!userId) {
          return new Response(
            JSON.stringify({ error: 'User ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Update profile
        if (updates.full_name !== undefined || updates.is_active !== undefined) {
          const profileUpdates: Record<string, unknown> = {}
          if (updates.full_name !== undefined) profileUpdates.full_name = updates.full_name
          if (updates.is_active !== undefined) profileUpdates.is_active = updates.is_active

          const { error: updateError } = await adminClient
            .from('profiles')
            .update(profileUpdates)
            .eq('user_id', userId)

          if (updateError) {
            console.error('Profile update error:', updateError)
            throw updateError
          }
        }

        // Update role if provided
        if (updates.role !== undefined) {
          const { error: roleUpdateError } = await adminClient
            .from('user_roles')
            .update({ role: updates.role })
            .eq('user_id', userId)

          if (roleUpdateError) {
            console.error('Role update error:', roleUpdateError)
            throw roleUpdateError
          }
        }

        console.log(`User ${userId} updated successfully by admin ${user.id}`)

        return new Response(
          JSON.stringify({ success: true, message: 'User updated successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'DELETE': {
        const body = await req.json()
        const { userId } = body

        if (!userId) {
          return new Response(
            JSON.stringify({ error: 'User ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Deactivate user instead of deleting
        const { error: deactivateError } = await adminClient
          .from('profiles')
          .update({ is_active: false })
          .eq('user_id', userId)

        if (deactivateError) {
          console.error('Deactivate error:', deactivateError)
          throw deactivateError
        }

        console.log(`User ${userId} deactivated by admin ${user.id}`)

        return new Response(
          JSON.stringify({ success: true, message: 'User deactivated successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error: unknown) {
    console.error('Admin users error:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
