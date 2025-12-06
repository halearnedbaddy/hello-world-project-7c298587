import { Card } from "@/components/ui/card";
import { Calendar, Clock, AlertCircle } from "lucide-react";

export const ParentExams = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Your Child's Upcoming Exams</h3>
        </div>
        <p className="text-muted-foreground">
          Exam schedules will appear here once they are set up by the school administration.
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Exam History</h3>
        <p className="text-muted-foreground">No completed exams</p>
      </Card>
    </div>
  );
};