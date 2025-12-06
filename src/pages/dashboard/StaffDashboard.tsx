import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStaffData } from '@/hooks/useStaffData';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { 
  Users, FileText, LogOut, GraduationCap, Heart, Search, 
  ClipboardList
} from 'lucide-react';

const StaffDashboard = () => {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const { students, classes, applications, medicalRecords, isLoading } = useStaffData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students?.filter((student: any) => 
    student.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admission_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-40" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Staff Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {profile?.full_name || 'Staff'}</p>
        </div>
        <Button onClick={signOut} variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{students?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{classes?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{applications?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Medical Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{medicalRecords?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Student Directory</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="medical">Medical Records</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Student Directory
              </CardTitle>
              <CardDescription>View student information</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredStudents && filteredStudents.length > 0 ? (
                <div className="space-y-3">
                  {filteredStudents.map((student: any) => (
                    <div key={student.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{student.profile?.full_name || 'Unknown'}</h4>
                        <p className="text-sm text-muted-foreground">
                          Admission: {student.admission_number || 'N/A'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Class: {student.class?.name || 'Unassigned'} {student.class?.section && `- ${student.class.section}`}
                        </p>
                      </div>
                      <Badge variant={student.enrollment_status === 'enrolled' ? 'default' : 'secondary'}>
                        {student.enrollment_status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No students found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Information</CardTitle>
              <CardDescription>View all classes</CardDescription>
            </CardHeader>
            <CardContent>
              {classes && classes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classes.map((cls: any) => (
                    <Card key={cls.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{cls.name} {cls.section && `- ${cls.section}`}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Year: {cls.academic_year}</p>
                        <p className="text-sm text-muted-foreground">Capacity: {cls.capacity}</p>
                        <p className="text-sm text-muted-foreground">
                          Enrolled: {students?.filter((s: any) => s.class_id === cls.id).length || 0}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No classes found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Admission Applications
              </CardTitle>
              <CardDescription>Track application status</CardDescription>
            </CardHeader>
            <CardContent>
              {applications && applications.length > 0 ? (
                <div className="space-y-3">
                  {applications.map((app: any) => (
                    <div key={app.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{app.applicant_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Applied: {new Date(app.created_at).toLocaleDateString()}
                          </p>
                          {app.class_applied && (
                            <p className="text-sm">Class: {app.class_applied.name}</p>
                          )}
                        </div>
                        <Badge variant={
                          app.status === 'approved' ? 'default' : 
                          app.status === 'rejected' ? 'destructive' : 'secondary'
                        }>
                          {app.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No applications</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Medical Records
              </CardTitle>
              <CardDescription>View student medical information</CardDescription>
            </CardHeader>
            <CardContent>
              {medicalRecords && medicalRecords.length > 0 ? (
                <div className="space-y-3">
                  {medicalRecords.map((record: any) => (
                    <div key={record.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">Student: {record.student?.admission_number || 'Unknown'}</h4>
                          <p className="text-sm"><strong>Blood Group:</strong> {record.blood_group || 'Not set'}</p>
                          <p className="text-sm"><strong>Allergies:</strong> {record.allergies || 'None'}</p>
                          <p className="text-sm"><strong>Conditions:</strong> {record.medical_conditions || 'None'}</p>
                          <p className="text-sm"><strong>Emergency:</strong> {record.emergency_contact} - {record.emergency_phone}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No medical records</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffDashboard;
