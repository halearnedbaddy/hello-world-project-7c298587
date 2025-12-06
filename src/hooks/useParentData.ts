import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useParentData = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: children, isLoading: childrenLoading } = useQuery({
    queryKey: ['parent-children', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          class:classes(*),
          profile:profiles!students_user_id_fkey(*)
        `)
        .eq('parent_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const childIds = children?.map(c => c.id) || [];

  const { data: academicRecords, isLoading: academicLoading } = useQuery({
    queryKey: ['parent-academic-records', childIds],
    queryFn: async () => {
      if (childIds.length === 0) return [];
      const { data, error } = await supabase
        .from('academic_records')
        .select(`
          *,
          student:students(*),
          subject:subjects(*)
        `)
        .in('student_id', childIds)
        .order('academic_year', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: childIds.length > 0,
  });

  const { data: medicalRecords, isLoading: medicalLoading } = useQuery({
    queryKey: ['parent-medical-records', childIds],
    queryFn: async () => {
      if (childIds.length === 0) return [];
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .in('student_id', childIds);
      
      if (error) throw error;
      return data;
    },
    enabled: childIds.length > 0,
  });

  const { data: disciplinaryRecords, isLoading: disciplinaryLoading } = useQuery({
    queryKey: ['parent-disciplinary-records', childIds],
    queryFn: async () => {
      if (childIds.length === 0) return [];
      const { data, error } = await supabase
        .from('disciplinary_records')
        .select('*')
        .in('student_id', childIds)
        .order('incident_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: childIds.length > 0,
  });

  const { data: promotions, isLoading: promotionsLoading } = useQuery({
    queryKey: ['parent-promotions', childIds],
    queryFn: async () => {
      if (childIds.length === 0) return [];
      const { data, error } = await supabase
        .from('promotions')
        .select(`
          *,
          student:students(*),
          from_class:classes!promotions_from_class_id_fkey(*),
          to_class:classes!promotions_to_class_id_fkey(*)
        `)
        .in('student_id', childIds)
        .order('academic_year', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: childIds.length > 0,
  });

  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ['parent-applications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('admission_applications')
        .select(`
          *,
          class_applied:classes(*)
        `)
        .eq('parent_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const createApplication = useMutation({
    mutationFn: async (application: {
      applicant_name: string;
      date_of_birth: string;
      class_applied: string;
      documents?: any;
      notes?: string;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('admission_applications')
        .insert({
          ...application,
          parent_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent-applications'] });
    },
  });

  const updateMedicalRecord = useMutation({
    mutationFn: async ({ studentId, data: medicalData }: { studentId: string; data: any }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { data: existing } = await supabase
        .from('medical_records')
        .select('id')
        .eq('student_id', studentId)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from('medical_records')
          .update({ ...medicalData, updated_by: user.id })
          .eq('student_id', studentId)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('medical_records')
          .insert({ ...medicalData, student_id: studentId, updated_by: user.id })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent-medical-records'] });
    },
  });

  return {
    children,
    academicRecords,
    medicalRecords,
    disciplinaryRecords,
    promotions,
    applications,
    createApplication,
    updateMedicalRecord,
    isLoading: childrenLoading || academicLoading || medicalLoading || disciplinaryLoading || promotionsLoading || applicationsLoading,
  };
};
