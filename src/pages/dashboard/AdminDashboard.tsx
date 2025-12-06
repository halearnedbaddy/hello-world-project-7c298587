import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminData } from '@/hooks/useAdminData';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { 
  Users, BookOpen, LogOut, Settings, FileText,
  Plus, Check, X, TrendingUp, GraduationCap, Search
} from 'lucide-react';

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { 
    students, 
    classes, 
    subjects, 
    applications,
    promotions,
    createClass,
    createSubject,
    updateApplication,
    createPromotion,
    updatePromotion,
    isLoading 
  } = useAdminData();

  const [searchTerm, setSearchTerm] = useState('');
  const [classForm, setClassForm] = useState({ name: '', section: '', academic_year: '', capacity: 40 });
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '', description: '' });
  const [promotionForm, setPromotionForm] = useState({ student_id: '', from_class_id: '', to_class_id: '', academic_year: '', status: 'pending', remarks: '' });
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);

  const filteredStudents = students?.filter((student: any) => 
    student.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admission_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClass = async () => {
    try {
      await createClass.mutateAsync(classForm);
      toast.success('Class created successfully');
      setIsClassDialogOpen(false);
      setClassForm({ name: '', section: '', academic_year: '', capacity: 40 });
    } catch (error) {
      toast.error('Failed to create class');
    }
  };

  const handleCreateSubject = async () => {
    try {
      await createSubject.mutateAsync(subjectForm);
      toast.success('Subject created successfully');
      setIsSubjectDialogOpen(false);
      setSubjectForm({ name: '', code: '', description: '' });
    } catch (error) {
      toast.error('Failed to create subject');
    }
  };

  const handleUpdateApplication = async (id: string, status: string) => {
    try {
      await updateApplication.mutateAsync({ id, status });
      toast.success(`Application ${status}`);
    } catch (error) {
      toast.error('Failed to update application');
    }
  };

  const handleCreatePromotion = async () => {
    try {
      await createPromotion.mutateAsync(promotionForm);
      toast.success('Promotion record created');
      setIsPromotionDialogOpen(false);
      setPromotionForm({ student_id: '', from_class_id: '', to_class_id: '', academic_year: '', status: 'pending', remarks: '' });
    } catch (error) {
      toast.error('Failed to create promotion');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {profile?.full_name || 'Admin'}</p>
        </div>
        <Button onClick={signOut} variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              <BookOpen className="h-4 w-4" />
              Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{subjects?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Pending Apps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {applications?.filter((a: any) => a.status === 'pending').length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Pending Promotions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {promotions?.filter((p: any) => p.status === 'pending').length || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Student Management</CardTitle>
                  <CardDescription>View and manage all students</CardDescription>
                </div>
                <Button onClick={() => navigate('/signup')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>
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
                          Admission: {student.admission_number || 'N/A'} | 
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
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Class Management</CardTitle>
                  <CardDescription>Create and manage classes</CardDescription>
                </div>
                <Dialog open={isClassDialogOpen} onOpenChange={setIsClassDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Class
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Class</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Class Name</Label>
                        <Input 
                          value={classForm.name}
                          onChange={(e) => setClassForm({...classForm, name: e.target.value})}
                          placeholder="e.g., Grade 10"
                        />
                      </div>
                      <div>
                        <Label>Section</Label>
                        <Input 
                          value={classForm.section}
                          onChange={(e) => setClassForm({...classForm, section: e.target.value})}
                          placeholder="e.g., A"
                        />
                      </div>
                      <div>
                        <Label>Academic Year</Label>
                        <Input 
                          value={classForm.academic_year}
                          onChange={(e) => setClassForm({...classForm, academic_year: e.target.value})}
                          placeholder="e.g., 2024-2025"
                        />
                      </div>
                      <div>
                        <Label>Capacity</Label>
                        <Input 
                          type="number"
                          value={classForm.capacity}
                          onChange={(e) => setClassForm({...classForm, capacity: parseInt(e.target.value)})}
                        />
                      </div>
                      <Button onClick={handleCreateClass} className="w-full">Create Class</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No classes created</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Subject Management</CardTitle>
                  <CardDescription>Create and manage subjects</CardDescription>
                </div>
                <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Subject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Subject</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Subject Name</Label>
                        <Input 
                          value={subjectForm.name}
                          onChange={(e) => setSubjectForm({...subjectForm, name: e.target.value})}
                          placeholder="e.g., Mathematics"
                        />
                      </div>
                      <div>
                        <Label>Subject Code</Label>
                        <Input 
                          value={subjectForm.code}
                          onChange={(e) => setSubjectForm({...subjectForm, code: e.target.value})}
                          placeholder="e.g., MATH101"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea 
                          value={subjectForm.description}
                          onChange={(e) => setSubjectForm({...subjectForm, description: e.target.value})}
                        />
                      </div>
                      <Button onClick={handleCreateSubject} className="w-full">Create Subject</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {subjects && subjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjects.map((subject: any) => (
                    <Card key={subject.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        {subject.code && <Badge variant="outline">{subject.code}</Badge>}
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{subject.description || 'No description'}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No subjects created</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admission Applications</CardTitle>
              <CardDescription>Review and process applications</CardDescription>
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
                            DOB: {app.date_of_birth ? new Date(app.date_of_birth).toLocaleDateString() : 'N/A'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Applied: {new Date(app.created_at).toLocaleDateString()}
                          </p>
                          {app.notes && <p className="text-sm mt-2">{app.notes}</p>}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={
                            app.status === 'approved' ? 'default' : 
                            app.status === 'rejected' ? 'destructive' : 'secondary'
                          }>
                            {app.status}
                          </Badge>
                          {app.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleUpdateApplication(app.id, 'approved')}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleUpdateApplication(app.id, 'rejected')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
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

        <TabsContent value="promotions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Promotion Management</CardTitle>
                  <CardDescription>Manage student promotions</CardDescription>
                </div>
                <Dialog open={isPromotionDialogOpen} onOpenChange={setIsPromotionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Promotion
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Promotion Record</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Student</Label>
                        <Select value={promotionForm.student_id} onValueChange={(v) => setPromotionForm({...promotionForm, student_id: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select student" />
                          </SelectTrigger>
                          <SelectContent>
                            {students?.map((s: any) => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.profile?.full_name || s.admission_number || 'Unknown'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>From Class</Label>
                        <Select value={promotionForm.from_class_id} onValueChange={(v) => setPromotionForm({...promotionForm, from_class_id: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes?.map((c: any) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name} {c.section && `- ${c.section}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>To Class</Label>
                        <Select value={promotionForm.to_class_id} onValueChange={(v) => setPromotionForm({...promotionForm, to_class_id: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes?.map((c: any) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name} {c.section && `- ${c.section}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Academic Year</Label>
                        <Input 
                          value={promotionForm.academic_year}
                          onChange={(e) => setPromotionForm({...promotionForm, academic_year: e.target.value})}
                          placeholder="e.g., 2024-2025"
                        />
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select value={promotionForm.status} onValueChange={(v) => setPromotionForm({...promotionForm, status: v})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="promoted">Promoted</SelectItem>
                            <SelectItem value="retained">Retained</SelectItem>
                            <SelectItem value="graduated">Graduated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Remarks</Label>
                        <Textarea 
                          value={promotionForm.remarks}
                          onChange={(e) => setPromotionForm({...promotionForm, remarks: e.target.value})}
                        />
                      </div>
                      <Button onClick={handleCreatePromotion} className="w-full">Create Promotion</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {promotions && promotions.length > 0 ? (
                <div className="space-y-3">
                  {promotions.map((promo: any) => (
                    <div key={promo.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{promo.student?.admission_number || 'Student'}</h4>
                          <p className="text-sm text-muted-foreground">
                            {promo.from_class?.name} → {promo.to_class?.name}
                          </p>
                          <p className="text-sm text-muted-foreground">Year: {promo.academic_year}</p>
                          {promo.remarks && <p className="text-sm mt-1">{promo.remarks}</p>}
                        </div>
                        <Badge variant={
                          promo.status === 'promoted' ? 'default' : 
                          promo.status === 'retained' ? 'destructive' : 
                          promo.status === 'graduated' ? 'secondary' : 'outline'
                        }>
                          {promo.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No promotion records</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
