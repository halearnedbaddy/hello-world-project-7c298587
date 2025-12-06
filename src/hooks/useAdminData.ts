import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminData = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // All students
  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['admin-students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          class:classes(*),
          profile:profiles!students_user_id_fkey(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // All classes
  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ['admin-classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // All subjects
  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ['admin-subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // All applications
  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ['admin-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admission_applications')
        .select(`
          *,
          class_applied:classes(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // All teacher assignments
  const { data: teacherAssignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ['admin-teacher-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teacher_assignments')
        .select(`
          *,
          class:classes(*),
          subject:subjects(*)
        `);
      
      if (error) throw error;
      return data;
    },
  });

  // All promotions
  const { data: promotions, isLoading: promotionsLoading } = useQuery({
    queryKey: ['admin-promotions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promotions')
        .select(`
          *,
          student:students(*),
          from_class:classes!promotions_from_class_id_fkey(*),
          to_class:classes!promotions_to_class_id_fkey(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Mutations
  const createClass = useMutation({
    mutationFn: async (classData: { name: string; section?: string; academic_year: string; capacity?: number }) => {
      const { data, error } = await supabase
        .from('classes')
        .insert(classData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-classes'] });
    },
  });

  const createSubject = useMutation({
    mutationFn: async (subjectData: { name: string; code?: string; description?: string }) => {
      const { data, error } = await supabase
        .from('subjects')
        .insert(subjectData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
    },
  });

  const createStudent = useMutation({
    mutationFn: async (studentData: { 
      user_id?: string; 
      admission_number?: string; 
      class_id?: string; 
      parent_id?: string;
      enrollment_status?: string;
    }) => {
      const { data, error } = await supabase
        .from('students')
        .insert(studentData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
    },
  });

  const updateStudent = useMutation({
    mutationFn: async ({ id, ...data }: { id: string; [key: string]: any }) => {
      const { data: updated, error } = await supabase
        .from('students')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
    },
  });

  const updateApplication = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const { data, error } = await supabase
        .from('admission_applications')
        .update({ status, notes, reviewed_by: user?.id })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
    },
  });

  const createTeacherAssignment = useMutation({
    mutationFn: async (assignmentData: { 
      teacher_id: string; 
      class_id: string; 
      subject_id?: string; 
      is_class_teacher?: boolean 
    }) => {
      const { data, error } = await supabase
        .from('teacher_assignments')
        .insert(assignmentData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-teacher-assignments'] });
    },
  });

  const createPromotion = useMutation({
    mutationFn: async (promotionData: {
      student_id: string;
      from_class_id?: string;
      to_class_id?: string;
      academic_year: string;
      status: string;
      remarks?: string;
    }) => {
      const { data, error } = await supabase
        .from('promotions')
        .insert({ ...promotionData, approved_by: user?.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promotions'] });
    },
  });

  const updatePromotion = useMutation({
    mutationFn: async ({ id, status, remarks }: { id: string; status: string; remarks?: string }) => {
      const { data, error } = await supabase
        .from('promotions')
        .update({ status, remarks, approved_by: user?.id })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promotions'] });
    },
  });

  return {
    students,
    classes,
    subjects,
    applications,
    teacherAssignments,
    promotions,
    createClass,
    createSubject,
    createStudent,
    updateStudent,
    updateApplication,
    createTeacherAssignment,
    createPromotion,
    updatePromotion,
    isLoading: studentsLoading || classesLoading || subjectsLoading || applicationsLoading || assignmentsLoading || promotionsLoading,
  };
};
