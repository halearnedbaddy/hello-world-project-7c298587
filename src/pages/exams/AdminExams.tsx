import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, FileText, Settings, CheckCircle, Clock } from "lucide-react";

export const AdminExams = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="setup">Exam Setup</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Exams</p>
                  <h3 className="text-2xl font-bold mt-1">5</h3>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Terms</p>
                  <h3 className="text-2xl font-bold mt-1">1</h3>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approvals</p>
                  <h3 className="text-2xl font-bold mt-1">8</h3>
                </div>
                <Clock className="w-8 h-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <h3 className="text-2xl font-bold mt-1">24</h3>
                </div>
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Current Academic Term</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Term Name:</span>
                <span className="font-medium">Term 1, 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start Date:</span>
                <span className="font-medium">Jan 6, 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">End Date:</span>
                <span className="font-medium">Apr 4, 2025</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="setup" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Exam Configuration</h3>
            <div className="space-y-4">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Term
              </Button>
              <div>
                <label className="text-sm font-medium">Grading System</label>
                <p className="text-sm text-muted-foreground">Configure A-F grading scale and pass marks</p>
              </div>
              <div>
                <label className="text-sm font-medium">Subject Weightage</label>
                <p className="text-sm text-muted-foreground">Set CAT vs Final exam percentages</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Mark Entry Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Mathematics - Form 1A</p>
                  <p className="text-sm text-muted-foreground">Mr. Kamau • 35/35 students</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Complete</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">English - Form 2B</p>
                  <p className="text-sm text-muted-foreground">Mrs. Wanjiru • 28/40 students</p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">In Progress</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">School Performance Analytics</h3>
              <Button variant="outline">Export to Excel</Button>
            </div>
            <p className="text-muted-foreground">View comprehensive performance reports across all classes and subjects</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
