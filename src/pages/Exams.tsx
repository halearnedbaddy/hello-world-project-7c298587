import { useAuth } from "@/contexts/AuthContext";
import { AdminExams } from "./exams/AdminExams";
import { TeacherExams } from "./exams/TeacherExams";
import { StudentExams } from "./exams/StudentExams";
import { ParentExams } from "./exams/ParentExams";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Exams = () => {
  const { userRole } = useAuth();

  const renderExamsByRole = () => {
    switch (userRole) {
      case 'admin':
      case 'headteacher':
        return <AdminExams />;
      case 'teacher':
      case 'staff':
        return <TeacherExams />;
      case 'student':
        return <StudentExams />;
      case 'parent':
        return <ParentExams />;
      default:
        return <div>Loading...</div>;
    }
  };

  const showCreateButton = userRole === 'admin' || userRole === 'headteacher';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Examinations</h1>
          <p className="text-muted-foreground mt-1">
            {userRole === 'student' ? 'View your exams and schedule' :
             userRole === 'parent' ? "View your child's exams" :
             'Manage exams, schedules, and question papers'}
          </p>
        </div>
        {showCreateButton && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Exam
          </Button>
        )}
      </div>

      {renderExamsByRole()}
    </div>
  );
};

export default Exams;
