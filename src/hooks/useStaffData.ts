import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useStaffData = () => {
  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['staff-students'],
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

  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ['staff-classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ['staff-applications'],
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

  const { data: medicalRecords, isLoading: medicalLoading } = useQuery({
    queryKey: ['staff-medical-records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_records')
        .select(`
          *,
          student:students(*)
        `);
      
      if (error) throw error;
      return data;
    },
  });

  return {
    students,
    classes,
    applications,
    medicalRecords,
    isLoading: studentsLoading || classesLoading || applicationsLoading || medicalLoading,
  };
};
