import { useAuth } from '@/contexts/AuthContext';
import { useStudentData } from '@/hooks/useStudentData';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, Calendar, BookOpen, LogOut, User, Heart, 
  AlertTriangle, TrendingUp, Clock 
} from 'lucide-react';

const DAYS = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const StudentDashboard = () => {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const { 
    studentRecord, 
    academicRecords, 
    subjectEnrollments, 
    medicalRecord, 
    disciplinaryRecords,
    promotions,
    timetable,
    isLoading 
  } = useStudentData();

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
          <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {profile?.full_name || 'Student'}</p>
          {studentRecord?.class && (
            <Badge variant="secondary" className="mt-2">
              Class: {studentRecord.class.name} {studentRecord.class.section && `- ${studentRecord.class.section}`}
            </Badge>
          )}
        </div>
        <Button onClick={signOut} variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academics">Academics</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="discipline">Discipline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Enrollment Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={studentRecord?.enrollment_status === 'enrolled' ? 'default' : 'secondary'}>
                  {studentRecord?.enrollment_status || 'Unknown'}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Subjects Enrolled
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{subjectEnrollments?.length || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Academic Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{academicRecords?.length || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Promotion Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={promotions?.[0]?.status === 'promoted' ? 'default' : 'secondary'}>
                  {promotions?.[0]?.status || 'Pending'}
                </Badge>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Details
                </CardTitle>
                <CardDescription>Your profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Name:</strong> {profile?.full_name || 'Not set'}</p>
                <p><strong>Email:</strong> {profile?.email || 'Not set'}</p>
                <p><strong>Phone:</strong> {profile?.phone || 'Not set'}</p>
                <p><strong>Address:</strong> {profile?.address || 'Not set'}</p>
                <p><strong>Date of Birth:</strong> {profile?.date_of_birth || 'Not set'}</p>
                <p><strong>Admission No:</strong> {studentRecord?.admission_number || 'Not set'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Academic Performance
                </CardTitle>
                <CardDescription>Your latest grades</CardDescription>
              </CardHeader>
              <CardContent>
                {academicRecords && academicRecords.length > 0 ? (
                  <div className="space-y-2">
                    {academicRecords.slice(0, 5).map((record: any) => (
                      <div key={record.id} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span>{record.subject?.name}</span>
                        <Badge>{record.grade || `${record.marks}%`}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No academic records found</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="academics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Records</CardTitle>
              <CardDescription>Your complete academic history</CardDescription>
            </CardHeader>
            <CardContent>
              {academicRecords && academicRecords.length > 0 ? (
                <div className="space-y-3">
                  {academicRecords.map((record: any) => (
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
                      {record.remarks && (
                        <p className="text-sm mt-2 text-muted-foreground">{record.remarks}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No academic records available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Subjects</CardTitle>
              <CardDescription>Subjects you are currently enrolled in</CardDescription>
            </CardHeader>
            <CardContent>
              {subjectEnrollments && subjectEnrollments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjectEnrollments.map((enrollment: any) => (
                    <Card key={enrollment.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{enrollment.subject?.name}</CardTitle>
                        {enrollment.subject?.code && (
                          <Badge variant="outline">{enrollment.subject.code}</Badge>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {enrollment.subject?.description || 'No description'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No subjects enrolled</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timetable" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Class Timetable
              </CardTitle>
              <CardDescription>Your weekly class schedule</CardDescription>
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
                              <span className="font-medium">{slot.subject?.name}</span>
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

        <TabsContent value="medical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Medical Information
              </CardTitle>
              <CardDescription>Your health records</CardDescription>
            </CardHeader>
            <CardContent>
              {medicalRecord ? (
                <div className="space-y-3">
                  <p><strong>Blood Group:</strong> {medicalRecord.blood_group || 'Not recorded'}</p>
                  <p><strong>Allergies:</strong> {medicalRecord.allergies || 'None recorded'}</p>
                  <p><strong>Medical Conditions:</strong> {medicalRecord.medical_conditions || 'None recorded'}</p>
                  <p><strong>Emergency Contact:</strong> {medicalRecord.emergency_contact || 'Not set'}</p>
                  <p><strong>Emergency Phone:</strong> {medicalRecord.emergency_phone || 'Not set'}</p>
                  {medicalRecord.notes && (
                    <p><strong>Notes:</strong> {medicalRecord.notes}</p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No medical records found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discipline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Disciplinary Records
              </CardTitle>
              <CardDescription>Your conduct history</CardDescription>
            </CardHeader>
            <CardContent>
              {disciplinaryRecords && disciplinaryRecords.length > 0 ? (
                <div className="space-y-3">
                  {disciplinaryRecords.map((record: any) => (
                    <div key={record.id} className="p-4 border border-destructive/20 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge variant="destructive">{record.incident_type}</Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(record.incident_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {record.description && (
                        <p className="mt-2">{record.description}</p>
                      )}
                      {record.action_taken && (
                        <p className="text-sm mt-2"><strong>Action:</strong> {record.action_taken}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No disciplinary records</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
