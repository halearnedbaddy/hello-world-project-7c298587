import { useAuth } from '@/contexts/AuthContext';
import { useTeacherData } from '@/hooks/useTeacherData';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { 
  Users, BookOpen, LogOut, Calendar, FileEdit, 
  Clock, Search 
} from 'lucide-react';

const DAYS = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TeacherDashboard = () => {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const { assignments, students, academicRecords, timetable, isLoading } = useTeacherData();
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
          <h1 className="text-3xl font-bold text-foreground">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {profile?.full_name || 'Teacher'}</p>
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
              <BookOpen className="h-4 w-4" />
              Assigned Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{new Set(assignments?.map((a: any) => a.class_id)).size || 0}</p>
          </CardContent>
        </Card>

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
              <FileEdit className="h-4 w-4" />
              Records Entered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{academicRecords?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Subjects Teaching
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{new Set(assignments?.map((a: any) => a.subject_id).filter(Boolean)).size || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">My Students</TabsTrigger>
          <TabsTrigger value="classes">My Classes</TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
          <TabsTrigger value="records">Academic Records</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Students in My Classes
              </CardTitle>
              <CardDescription>View and manage your students</CardDescription>
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
                          Class: {student.class?.name} {student.class?.section && `- ${student.class.section}`}
                        </p>
                      </div>
                      <Badge variant={student.enrollment_status === 'enrolled' ? 'default' : 'secondary'}>
                        {student.enrollment_status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No students found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Class Assignments</CardTitle>
              <CardDescription>Classes and subjects assigned to you</CardDescription>
            </CardHeader>
            <CardContent>
              {assignments && assignments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignments.map((assignment: any) => (
                    <Card key={assignment.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          {assignment.class?.name} {assignment.class?.section && `- ${assignment.class.section}`}
                        </CardTitle>
                        {assignment.is_class_teacher && (
                          <Badge>Class Teacher</Badge>
                        )}
                      </CardHeader>
                      <CardContent>
                        {assignment.subject && (
                          <p className="text-sm">
                            <strong>Subject:</strong> {assignment.subject.name}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Academic Year: {assignment.class?.academic_year}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No class assignments found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timetable" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                My Teaching Schedule
              </CardTitle>
              <CardDescription>Your weekly timetable</CardDescription>
            </CardHeader>
            <CardContent>
              {timetable && timetable.length > 0 ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(day => {
                    const daySchedule = timetable.filter((t: any) => t.day_of_week === day);
                    if (daySchedule.length === 0) return null;
                    return (
                      <div key={day}>
                        <h4 className="font-semibold mb-2">{DAYS[day]}</h4>
                        <div className="space-y-2">
                          {daySchedule.map((slot: any) => (
                            <div key={slot.id} className="flex justify-between items-center p-3 bg-muted rounded">
                              <div>
                                <span className="font-medium">{slot.subject?.name}</span>
                                <p className="text-sm text-muted-foreground">
                                  {slot.class?.name} {slot.class?.section && `- ${slot.class.section}`}
                                </p>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {slot.start_time} - {slot.end_time}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No timetable available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Records</CardTitle>
              <CardDescription>Records you have entered for students</CardDescription>
            </CardHeader>
            <CardContent>
              {academicRecords && academicRecords.length > 0 ? (
                <div className="space-y-3">
                  {academicRecords.slice(0, 20).map((record: any) => (
                    <div key={record.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{record.subject?.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {record.academic_year} - {record.term}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{record.marks}%</Badge>
                          {record.grade && <Badge className="ml-2">{record.grade}</Badge>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No academic records entered yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboard;
