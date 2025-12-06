import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, TrendingUp } from "lucide-react";

export const TeacherResults = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="entry" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entry">Marks Entry</TabsTrigger>
          <TabsTrigger value="submitted">Submitted Results</TabsTrigger>
          <TabsTrigger value="analysis">Class Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="entry" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Enter Student Marks</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <Label>Select Term</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3">
                  <option>Term 1, 2025</option>
                  <option>Term 2, 2024</option>
                </select>
              </div>
              <div>
                <Label>Select Exam</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3">
                  <option>CAT 1</option>
                  <option>Mid Term</option>
                </select>
              </div>
              <div>
                <Label>Select Class</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3">
                  <option>Form 1A</option>
                  <option>Form 1B</option>
                </select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Admission No.</TableHead>
                    <TableHead>Marks (Out of 100)</TableHead>
                    <TableHead>Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>John Doe</TableCell>
                    <TableCell>ADM001</TableCell>
                    <TableCell>
                      <Input type="number" placeholder="0" className="w-20" />
                    </TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>ADM002</TableCell>
                    <TableCell>
                      <Input type="number" placeholder="0" className="w-20" />
                    </TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline">Save as Draft</Button>
              <Button>Submit for Approval</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Submitted Results</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Mathematics Form 1A - CAT 1</p>
                  <p className="text-sm text-muted-foreground">Submitted on Jan 20, 2025</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Approved</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Mathematics Form 2B - CAT 1</p>
                  <p className="text-sm text-muted-foreground">Submitted on Jan 21, 2025</p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pending</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Class Average</p>
                  <h3 className="text-2xl font-bold mt-1">72.5%</h3>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Highest Score</p>
                  <h3 className="text-2xl font-bold mt-1">95%</h3>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pass Rate</p>
                  <h3 className="text-2xl font-bold mt-1">87%</h3>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Download Reports</h3>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Class Report
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
