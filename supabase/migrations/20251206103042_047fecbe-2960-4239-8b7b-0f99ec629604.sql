
-- Create app_role enum if not exists
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'headteacher', 'teacher', 'staff', 'parent', 'student');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- User roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    date_of_birth DATE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Classes table
CREATE TABLE public.classes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    section TEXT,
    academic_year TEXT NOT NULL,
    capacity INTEGER DEFAULT 40,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Subjects table
CREATE TABLE public.subjects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Students table
CREATE TABLE public.students (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    admission_number TEXT UNIQUE,
    class_id uuid REFERENCES public.classes(id),
    parent_id uuid REFERENCES auth.users(id),
    enrollment_status TEXT DEFAULT 'enrolled' CHECK (enrollment_status IN ('pending', 'enrolled', 'graduated', 'withdrawn')),
    admission_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Teacher assignments (links teachers to classes/subjects)
CREATE TABLE public.teacher_assignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE,
    is_class_teacher BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (teacher_id, class_id, subject_id)
);

-- Subject enrollments (links students to subjects)
CREATE TABLE public.subject_enrollments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (student_id, subject_id)
);

-- Academic records
CREATE TABLE public.academic_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
    class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    academic_year TEXT NOT NULL,
    term TEXT NOT NULL,
    marks NUMERIC(5,2),
    grade TEXT,
    remarks TEXT,
    recorded_by uuid REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Medical records
CREATE TABLE public.medical_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    blood_group TEXT,
    allergies TEXT,
    medical_conditions TEXT,
    emergency_contact TEXT,
    emergency_phone TEXT,
    notes TEXT,
    updated_by uuid REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Disciplinary records
CREATE TABLE public.disciplinary_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    incident_date DATE NOT NULL,
    incident_type TEXT NOT NULL,
    description TEXT,
    action_taken TEXT,
    recorded_by uuid REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Admissions/Enrollment applications
CREATE TABLE public.admission_applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_name TEXT NOT NULL,
    date_of_birth DATE,
    parent_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    class_applied uuid REFERENCES public.classes(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
    documents JSONB,
    notes TEXT,
    reviewed_by uuid REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Promotions
CREATE TABLE public.promotions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    from_class_id uuid REFERENCES public.classes(id),
    to_class_id uuid REFERENCES public.classes(id),
    academic_year TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'promoted', 'retained', 'graduated')),
    remarks TEXT,
    approved_by uuid REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Class timetable
CREATE TABLE public.timetable (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
    teacher_id uuid REFERENCES auth.users(id),
    day_of_week INTEGER CHECK (day_of_week BETWEEN 1 AND 7),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disciplinary_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Get student ID for a user
CREATE OR REPLACE FUNCTION public.get_student_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.students WHERE user_id = _user_id LIMIT 1
$$;

-- Check if teacher is assigned to a class
CREATE OR REPLACE FUNCTION public.teacher_has_class(_teacher_id uuid, _class_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.teacher_assignments
    WHERE teacher_id = _teacher_id AND class_id = _class_id
  )
$$;

-- Check if parent has child in students
CREATE OR REPLACE FUNCTION public.parent_has_student(_parent_id uuid, _student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.students
    WHERE parent_id = _parent_id AND id = _student_id
  )
$$;

-- USER_ROLES POLICIES
CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can view student profiles" ON public.profiles
  FOR SELECT USING (
    public.has_role(auth.uid(), 'teacher') AND
    id IN (SELECT user_id FROM public.students WHERE class_id IN (
      SELECT class_id FROM public.teacher_assignments WHERE teacher_id = auth.uid()
    ))
  );

-- CLASSES POLICIES
CREATE POLICY "Anyone authenticated can view classes" ON public.classes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage classes" ON public.classes
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- SUBJECTS POLICIES
CREATE POLICY "Anyone authenticated can view subjects" ON public.subjects
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage subjects" ON public.subjects
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- STUDENTS POLICIES
CREATE POLICY "Students can view own record" ON public.students
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Teachers can view assigned students" ON public.students
  FOR SELECT USING (
    public.has_role(auth.uid(), 'teacher') AND
    class_id IN (SELECT class_id FROM public.teacher_assignments WHERE teacher_id = auth.uid())
  );

CREATE POLICY "Parents can view own children" ON public.students
  FOR SELECT USING (parent_id = auth.uid());

CREATE POLICY "Admins can manage all students" ON public.students
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can view students" ON public.students
  FOR SELECT USING (public.has_role(auth.uid(), 'staff'));

-- TEACHER_ASSIGNMENTS POLICIES
CREATE POLICY "Teachers can view own assignments" ON public.teacher_assignments
  FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "Admins can manage teacher assignments" ON public.teacher_assignments
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view teacher assignments for their class" ON public.teacher_assignments
  FOR SELECT USING (
    class_id IN (SELECT class_id FROM public.students WHERE user_id = auth.uid())
  );

-- SUBJECT_ENROLLMENTS POLICIES
CREATE POLICY "Students can view own enrollments" ON public.subject_enrollments
  FOR SELECT USING (
    student_id = public.get_student_id(auth.uid())
  );

CREATE POLICY "Teachers can view enrollments for assigned classes" ON public.subject_enrollments
  FOR SELECT USING (
    public.has_role(auth.uid(), 'teacher') AND
    student_id IN (
      SELECT id FROM public.students WHERE class_id IN (
        SELECT class_id FROM public.teacher_assignments WHERE teacher_id = auth.uid()
      )
    )
  );

CREATE POLICY "Parents can view child enrollments" ON public.subject_enrollments
  FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
  );

CREATE POLICY "Admins can manage enrollments" ON public.subject_enrollments
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ACADEMIC_RECORDS POLICIES
CREATE POLICY "Students can view own academic records" ON public.academic_records
  FOR SELECT USING (student_id = public.get_student_id(auth.uid()));

CREATE POLICY "Teachers can view/manage assigned student records" ON public.academic_records
  FOR ALL USING (
    public.has_role(auth.uid(), 'teacher') AND
    student_id IN (
      SELECT id FROM public.students WHERE class_id IN (
        SELECT class_id FROM public.teacher_assignments WHERE teacher_id = auth.uid()
      )
    )
  );

CREATE POLICY "Parents can view child academic records" ON public.academic_records
  FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
  );

CREATE POLICY "Admins can manage all academic records" ON public.academic_records
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- MEDICAL_RECORDS POLICIES
CREATE POLICY "Students can view own medical records" ON public.medical_records
  FOR SELECT USING (student_id = public.get_student_id(auth.uid()));

CREATE POLICY "Teachers can view student medical records" ON public.medical_records
  FOR SELECT USING (
    public.has_role(auth.uid(), 'teacher') AND
    student_id IN (
      SELECT id FROM public.students WHERE class_id IN (
        SELECT class_id FROM public.teacher_assignments WHERE teacher_id = auth.uid()
      )
    )
  );

CREATE POLICY "Parents can view/update child medical records" ON public.medical_records
  FOR ALL USING (
    student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
  );

CREATE POLICY "Admins can manage all medical records" ON public.medical_records
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can view medical records" ON public.medical_records
  FOR SELECT USING (public.has_role(auth.uid(), 'staff'));

-- DISCIPLINARY_RECORDS POLICIES
CREATE POLICY "Students can view own disciplinary records" ON public.disciplinary_records
  FOR SELECT USING (student_id = public.get_student_id(auth.uid()));

CREATE POLICY "Teachers can view/add disciplinary records" ON public.disciplinary_records
  FOR ALL USING (
    public.has_role(auth.uid(), 'teacher') AND
    student_id IN (
      SELECT id FROM public.students WHERE class_id IN (
        SELECT class_id FROM public.teacher_assignments WHERE teacher_id = auth.uid()
      )
    )
  );

CREATE POLICY "Parents can view child disciplinary records" ON public.disciplinary_records
  FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
  );

CREATE POLICY "Admins can manage all disciplinary records" ON public.disciplinary_records
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ADMISSION_APPLICATIONS POLICIES
CREATE POLICY "Parents can manage own applications" ON public.admission_applications
  FOR ALL USING (parent_id = auth.uid());

CREATE POLICY "Admins can manage all applications" ON public.admission_applications
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can view applications" ON public.admission_applications
  FOR SELECT USING (public.has_role(auth.uid(), 'staff'));

-- PROMOTIONS POLICIES
CREATE POLICY "Students can view own promotion status" ON public.promotions
  FOR SELECT USING (student_id = public.get_student_id(auth.uid()));

CREATE POLICY "Teachers can view student promotions" ON public.promotions
  FOR SELECT USING (
    public.has_role(auth.uid(), 'teacher') AND
    student_id IN (
      SELECT id FROM public.students WHERE class_id IN (
        SELECT class_id FROM public.teacher_assignments WHERE teacher_id = auth.uid()
      )
    )
  );

CREATE POLICY "Parents can view child promotions" ON public.promotions
  FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
  );

CREATE POLICY "Admins can manage all promotions" ON public.promotions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- TIMETABLE POLICIES
CREATE POLICY "Anyone authenticated can view timetable" ON public.timetable
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage timetable" ON public.timetable
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name', new.email);
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academic_records_updated_at BEFORE UPDATE ON public.academic_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON public.medical_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admission_applications_updated_at BEFORE UPDATE ON public.admission_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
