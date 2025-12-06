import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Award, MessageSquare } from "lucide-react";

export const ParentResults = () => {
  return (
    <div className="space-y-6">
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Award className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <p className="font-semibold text-blue-900">New Results Available</p>
            <p className="text-sm text-blue-700">Your child's CAT 1 results have been published</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Average</p>
              <h3 className="text-2xl font-bold mt-1">78%</h3>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Class Position</p>
              <h3 className="text-2xl font-bold mt-1">5th/35</h3>
            </div>
            <Award className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Improvement</p>
              <h3 className="text-2xl font-bold mt-1 text-green-600">+5%</h3>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Term 1, 2025 - CAT 1 Results</h3>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Download Report Card
          </Button>
        </div>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Mathematics</span>
              <span className="text-2xl font-bold text-primary">85</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Grade: A</span>
              <span>Class Average: 72</span>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium mb-1">Teacher: Mr. Kamau</p>
              <p className="text-sm text-muted-foreground">
                Excellent performance. Keep up the good work!
              </p>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">English</span>
              <span className="text-2xl font-bold text-primary">78</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Grade: B+</span>
              <span>Class Average: 70</span>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium mb-1">Teacher: Mrs. Wanjiru</p>
              <p className="text-sm text-muted-foreground">
                Good work. Focus on essay writing skills.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Comparison</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Your Child vs Class Average</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm w-24">Mathematics</span>
                <div className="flex-1 h-6 bg-muted rounded relative">
                  <div className="absolute h-full bg-blue-200 rounded" style={{ width: '72%' }} />
                  <div className="absolute h-full bg-primary rounded" style={{ width: '85%' }} />
                </div>
                <span className="text-sm w-12 text-right">+13</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm w-24">English</span>
                <div className="flex-1 h-6 bg-muted rounded relative">
                  <div className="absolute h-full bg-blue-200 rounded" style={{ width: '70%' }} />
                  <div className="absolute h-full bg-primary rounded" style={{ width: '78%' }} />
                </div>
                <span className="text-sm w-12 text-right">+8</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Headteacher's Comment</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          "Commendable performance. The student shows great potential and consistency. Encourage continued effort in all subjects."
        </p>
        <Button variant="outline" className="w-full">
          <MessageSquare className="w-4 h-4 mr-2" />
          Message Class Teacher
        </Button>
      </Card>
    </div>
  );
};
