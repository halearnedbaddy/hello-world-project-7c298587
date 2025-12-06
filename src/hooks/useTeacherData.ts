import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useTeacherData = () => {
  const { user } = useAuth();

  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ['teacher-assignments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('teacher_assignments')
        .select(`
          *,
          class:classes(*),
          subject:subjects(*)
        `)
        .eq('teacher_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const classIds = assignments?.map(a => a.class_id).filter(Boolean) || [];

  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['teacher-students', classIds],
    queryFn: async () => {
      if (classIds.length === 0) return [];
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          class:classes(*),
          profile:profiles!students_user_id_fkey(*)
        `)
        .in('class_id', classIds);
      
      if (error) throw error;
      return data;
    },
    enabled: classIds.length > 0,
  });

  const { data: academicRecords, isLoading: recordsLoading } = useQuery({
    queryKey: ['teacher-academic-records', classIds],
    queryFn: async () => {
      if (classIds.length === 0) return [];
      const { data, error } = await supabase
        .from('academic_records')
        .select(`
          *,
          student:students(*),
          subject:subjects(*)
        `)
        .in('class_id', classIds)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: classIds.length > 0,
  });

  const { data: timetable, isLoading: timetableLoading } = useQuery({
    queryKey: ['teacher-timetable', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('timetable')
        .select(`
          *,
          class:classes(*),
          subject:subjects(*)
        `)
        .eq('teacher_id', user.id)
        .order('day_of_week')
        .order('start_time');
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return {
    assignments,
    students,
    academicRecords,
    timetable,
    isLoading: assignmentsLoading || studentsLoading || recordsLoading || timetableLoading,
  };
};
