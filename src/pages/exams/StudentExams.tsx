import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, FileText } from "lucide-react";

export const StudentExams = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="schedule">My Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Exams</h3>
            <p className="text-muted-foreground">
              No upcoming exams scheduled. Check back later for exam announcements.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Completed Exams</h3>
            <p className="text-muted-foreground">No completed exams</p>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Exam Timetable</h3>
            <p className="text-muted-foreground">No exams scheduled</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};