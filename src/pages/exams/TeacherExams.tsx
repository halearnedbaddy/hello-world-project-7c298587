import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Upload, FileText, BarChart3 } from "lucide-react";

export const TeacherExams = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="my-exams" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-exams">My Exams</TabsTrigger>
          <TabsTrigger value="mark-entry">Mark Entry</TabsTrigger>
          <TabsTrigger value="analysis">Class Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="my-exams" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Assigned Exams</h3>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload Exam Paper
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">CAT 1 - Mathematics Form 1A</p>
                  <p className="text-sm text-muted-foreground">Feb 15, 2025 • 2:00 PM - 3:30 PM</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button size="sm">Upload Paper</Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">CAT 1 - Mathematics Form 2B</p>
                  <p className="text-sm text-muted-foreground">Feb 16, 2025 • 2:00 PM - 3:30 PM</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button size="sm">Upload Paper</Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="mark-entry" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Enter Student Marks</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Mathematics Form 1A - CAT 1</p>
                  <p className="text-sm text-muted-foreground">35 students • Draft saved</p>
                </div>
                <Button>Continue Entry</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Mathematics Form 2B - CAT 1</p>
                  <p className="text-sm text-muted-foreground">40 students • Not started</p>
                </div>
                <Button>Start Entry</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Class Performance</h3>
              <Button variant="outline">Download Report</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Class Average</p>
                <p className="text-2xl font-bold mt-1">72.5%</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Highest Score</p>
                <p className="text-2xl font-bold mt-1">95%</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Pass Rate</p>
                <p className="text-2xl font-bold mt-1">87%</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Detailed performance analytics for your classes</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
