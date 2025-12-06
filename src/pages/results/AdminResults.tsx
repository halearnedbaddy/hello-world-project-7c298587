import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Award, CheckCircle, Clock } from "lucide-react";

export const AdminResults = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="approval">Approval Queue</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">School Average</p>
                  <h3 className="text-2xl font-bold mt-1">74.2%</h3>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pass Rate</p>
                  <h3 className="text-2xl font-bold mt-1">92%</h3>
                </div>
                <Award className="w-8 h-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Published Results</p>
                  <h3 className="text-2xl font-bold mt-1">156</h3>
                </div>
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <h3 className="text-2xl font-bold mt-1">8</h3>
                </div>
                <Clock className="w-8 h-8 text-primary" />
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Class Performance Summary</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Form 1A</span>
                  <span className="text-sm text-muted-foreground">78%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Form 2B</span>
                  <span className="text-sm text-muted-foreground">82%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '82%' }} />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="approval" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Pending Approvals</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Mathematics - Form 1A (CAT 1)</p>
                  <p className="text-sm text-muted-foreground">Submitted by Mr. Kamau • 35 students</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Review</Button>
                  <Button size="sm">Approve</Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">English - Form 2B (CAT 1)</p>
                  <p className="text-sm text-muted-foreground">Submitted by Mrs. Wanjiru • 40 students</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Review</Button>
                  <Button size="sm">Approve</Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">School Reports</h3>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export All Reports
              </Button>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Download Term Performance Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Download Subject Analysis
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Download Teacher Performance Report
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
            <p className="text-muted-foreground">Comprehensive analytics showing term-by-term performance trends across all classes and subjects</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
