import { useAuth } from "@/contexts/AuthContext";
import { AdminResults } from "./results/AdminResults";
import { TeacherResults } from "./results/TeacherResults";
import { StudentResults } from "./results/StudentResults";
import { ParentResults } from "./results/ParentResults";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";

const Results = () => {
  const { userRole } = useAuth();

  const renderResultsByRole = () => {
    switch (userRole) {
      case 'admin':
      case 'headteacher':
        return <AdminResults />;
      case 'teacher':
      case 'staff':
        return <TeacherResults />;
      case 'student':
        return <StudentResults />;
      case 'parent':
        return <ParentResults />;
      default:
        return <div>Loading...</div>;
    }
  };

  const showActionButtons = userRole === 'admin' || userRole === 'headteacher' || userRole === 'teacher' || userRole === 'staff';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Results Management</h1>
          <p className="text-muted-foreground mt-1">
            {userRole === 'student' ? 'View your academic results' :
             userRole === 'parent' ? "View your child's results" :
             'Enter marks, approve results, and generate reports'}
          </p>
        </div>
        {showActionButtons && (
          <div className="flex gap-2">
            {(userRole === 'teacher' || userRole === 'staff') && (
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import Marks
              </Button>
            )}
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export Reports
            </Button>
          </div>
        )}
      </div>

      {renderResultsByRole()}
    </div>
  );
};

export default Results;
