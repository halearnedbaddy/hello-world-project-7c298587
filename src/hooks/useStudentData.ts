import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useStudentData = () => {
  const { user } = useAuth();

  const { data: studentRecord, isLoading: studentLoading } = useQuery({
    queryKey: ['student-record', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          class:classes(*),
          profile:profiles!students_user_id_fkey(*)
        `)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: academicRecords, isLoading: academicLoading } = useQuery({
    queryKey: ['academic-records', studentRecord?.id],
    queryFn: async () => {
      if (!studentRecord?.id) return [];
      const { data, error } = await supabase
        .from('academic_records')
        .select(`
          *,
          subject:subjects(*)
        `)
        .eq('student_id', studentRecord.id)
        .order('academic_year', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!studentRecord?.id,
  });

  const { data: subjectEnrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['subject-enrollments', studentRecord?.id],
    queryFn: async () => {
      if (!studentRecord?.id) return [];
      const { data, error } = await supabase
        .from('subject_enrollments')
        .select(`
          *,
          subject:subjects(*)
        `)
        .eq('student_id', studentRecord.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!studentRecord?.id,
  });

  const { data: medicalRecord, isLoading: medicalLoading } = useQuery({
    queryKey: ['medical-record', studentRecord?.id],
    queryFn: async () => {
      if (!studentRecord?.id) return null;
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('student_id', studentRecord.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!studentRecord?.id,
  });

  const { data: disciplinaryRecords, isLoading: disciplinaryLoading } = useQuery({
    queryKey: ['disciplinary-records', studentRecord?.id],
    queryFn: async () => {
      if (!studentRecord?.id) return [];
      const { data, error } = await supabase
        .from('disciplinary_records')
        .select('*')
        .eq('student_id', studentRecord.id)
        .order('incident_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!studentRecord?.id,
  });

  const { data: promotions, isLoading: promotionsLoading } = useQuery({
    queryKey: ['promotions', studentRecord?.id],
    queryFn: async () => {
      if (!studentRecord?.id) return [];
      const { data, error } = await supabase
        .from('promotions')
        .select(`
          *,
          from_class:classes!promotions_from_class_id_fkey(*),
          to_class:classes!promotions_to_class_id_fkey(*)
        `)
        .eq('student_id', studentRecord.id)
        .order('academic_year', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!studentRecord?.id,
  });

  const { data: timetable, isLoading: timetableLoading } = useQuery({
    queryKey: ['timetable', studentRecord?.class_id],
    queryFn: async () => {
      if (!studentRecord?.class_id) return [];
      const { data, error } = await supabase
        .from('timetable')
        .select(`
          *,
          subject:subjects(*)
        `)
        .eq('class_id', studentRecord.class_id)
        .order('day_of_week')
        .order('start_time');
      
      if (error) throw error;
      return data;
    },
    enabled: !!studentRecord?.class_id,
  });

  return {
    studentRecord,
    academicRecords,
    subjectEnrollments,
    medicalRecord,
    disciplinaryRecords,
    promotions,
    timetable,
    isLoading: studentLoading || academicLoading || enrollmentsLoading || medicalLoading || disciplinaryLoading || promotionsLoading || timetableLoading,
  };
};
