import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Award } from "lucide-react";

export const StudentResults = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Average</p>
              <h3 className="text-2xl font-bold mt-1">--</h3>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Exams</p>
              <h3 className="text-2xl font-bold mt-1">0</h3>
            </div>
            <Award className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Best Subject</p>
              <h3 className="text-lg font-bold mt-1">N/A</h3>
            </div>
            <Award className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Results</h3>
          <Button disabled>
            <Download className="w-4 h-4 mr-2" />
            Download Report Card
          </Button>
        </div>
        <p className="text-muted-foreground">
          No results available yet. Results will appear here once your teachers have graded your exams.
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
        <p className="text-muted-foreground">No data available</p>
      </Card>
    </div>
  );
};