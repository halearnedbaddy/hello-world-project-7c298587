import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParentData } from '@/hooks/useParentData';
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
import { toast } from 'sonner';
import { 
  Users, FileText, LogOut, Calendar, Heart, 
  AlertTriangle, TrendingUp, Plus, Edit 
} from 'lucide-react';

const ParentDashboard = () => {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const { 
    children, 
    academicRecords, 
    medicalRecords, 
    disciplinaryRecords,
    promotions,
    applications,
    createApplication,
    updateMedicalRecord,
    isLoading 
  } = useParentData();

  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [applicationForm, setApplicationForm] = useState({
    applicant_name: '',
    date_of_birth: '',
    class_applied: '',
    notes: '',
  });
  const [medicalForm, setMedicalForm] = useState({
    blood_group: '',
    allergies: '',
    medical_conditions: '',
    emergency_contact: '',
    emergency_phone: '',
  });
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [isMedicalDialogOpen, setIsMedicalDialogOpen] = useState(false);

  const handleCreateApplication = async () => {
    try {
      await createApplication.mutateAsync(applicationForm);
      toast.success('Application submitted successfully');
      setIsApplicationDialogOpen(false);
      setApplicationForm({ applicant_name: '', date_of_birth: '', class_applied: '', notes: '' });
    } catch (error) {
      toast.error('Failed to submit application');
    }
  };

  const handleUpdateMedical = async () => {
    if (!selectedChild) return;
    try {
      await updateMedicalRecord.mutateAsync({ studentId: selectedChild, data: medicalForm });
      toast.success('Medical record updated');
      setIsMedicalDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update medical record');
    }
  };

  const getChildRecords = (childId: string) => {
    return {
      academic: academicRecords?.filter((r: any) => r.student_id === childId) || [],
      medical: medicalRecords?.find((r: any) => r.student_id === childId),
      disciplinary: disciplinaryRecords?.filter((r: any) => r.student_id === childId) || [],
      promotion: promotions?.filter((r: any) => r.student_id === childId) || [],
    };
  };

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
          <h1 className="text-3xl font-bold text-foreground">Parent Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {profile?.full_name || 'Parent'}</p>
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
              Children Enrolled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{children?.length || 0}</p>
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
              <Calendar className="h-4 w-4" />
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
              Academic Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{academicRecords?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="children" className="space-y-4">
        <TabsList>
          <TabsTrigger value="children">My Children</TabsTrigger>
          <TabsTrigger value="applications">Admissions</TabsTrigger>
        </TabsList>

        <TabsContent value="children" className="space-y-4">
          {children && children.length > 0 ? (
            <div className="space-y-6">
              {children.map((child: any) => {
                const childRecords = getChildRecords(child.id);
                return (
                  <Card key={child.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {child.profile?.full_name || 'Child'}
                          </CardTitle>
                          <CardDescription>
                            Class: {child.class?.name} {child.class?.section && `- ${child.class.section}`} | 
                            Admission: {child.admission_number || 'N/A'}
                          </CardDescription>
                        </div>
                        <Badge variant={child.enrollment_status === 'enrolled' ? 'default' : 'secondary'}>
                          {child.enrollment_status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="academic" className="space-y-4">
                        <TabsList>
                          <TabsTrigger value="academic">Academics</TabsTrigger>
                          <TabsTrigger value="medical">Medical</TabsTrigger>
                          <TabsTrigger value="discipline">Discipline</TabsTrigger>
                          <TabsTrigger value="promotion">Promotion</TabsTrigger>
                        </TabsList>

                        <TabsContent value="academic">
                          {childRecords.academic.length > 0 ? (
                            <div className="space-y-2">
                              {childRecords.academic.slice(0, 5).map((record: any) => (
                                <div key={record.id} className="flex justify-between items-center p-3 bg-muted rounded">
                                  <div>
                                    <span className="font-medium">{record.subject?.name}</span>
                                    <p className="text-sm text-muted-foreground">
                                      {record.academic_year} - {record.term}
                                    </p>
                                  </div>
                                  <Badge>{record.grade || `${record.marks}%`}</Badge>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No academic records</p>
                          )}
                        </TabsContent>

                        <TabsContent value="medical">
                          <div className="space-y-4">
                            {childRecords.medical ? (
                              <div className="space-y-2">
                                <p><strong>Blood Group:</strong> {childRecords.medical.blood_group || 'Not set'}</p>
                                <p><strong>Allergies:</strong> {childRecords.medical.allergies || 'None'}</p>
                                <p><strong>Medical Conditions:</strong> {childRecords.medical.medical_conditions || 'None'}</p>
                                <p><strong>Emergency Contact:</strong> {childRecords.medical.emergency_contact || 'Not set'}</p>
                                <p><strong>Emergency Phone:</strong> {childRecords.medical.emergency_phone || 'Not set'}</p>
                              </div>
                            ) : (
                              <p className="text-muted-foreground">No medical records</p>
                            )}
                            <Dialog open={isMedicalDialogOpen && selectedChild === child.id} onOpenChange={(open) => {
                              setIsMedicalDialogOpen(open);
                              if (open) {
                                setSelectedChild(child.id);
                                if (childRecords.medical) {
                                  setMedicalForm({
                                    blood_group: childRecords.medical.blood_group || '',
                                    allergies: childRecords.medical.allergies || '',
                                    medical_conditions: childRecords.medical.medical_conditions || '',
                                    emergency_contact: childRecords.medical.emergency_contact || '',
                                    emergency_phone: childRecords.medical.emergency_phone || '',
                                  });
                                }
                              }
                            }}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Update Medical Info
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Update Medical Information</DialogTitle>
                                  <DialogDescription>
                                    Update emergency contact and medical information
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Blood Group</Label>
                                    <Input 
                                      value={medicalForm.blood_group}
                                      onChange={(e) => setMedicalForm({...medicalForm, blood_group: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <Label>Allergies</Label>
                                    <Input 
                                      value={medicalForm.allergies}
                                      onChange={(e) => setMedicalForm({...medicalForm, allergies: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <Label>Medical Conditions</Label>
                                    <Textarea 
                                      value={medicalForm.medical_conditions}
                                      onChange={(e) => setMedicalForm({...medicalForm, medical_conditions: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <Label>Emergency Contact</Label>
                                    <Input 
                                      value={medicalForm.emergency_contact}
                                      onChange={(e) => setMedicalForm({...medicalForm, emergency_contact: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <Label>Emergency Phone</Label>
                                    <Input 
                                      value={medicalForm.emergency_phone}
                                      onChange={(e) => setMedicalForm({...medicalForm, emergency_phone: e.target.value})}
                                    />
                                  </div>
                                  <Button onClick={handleUpdateMedical} className="w-full">
                                    Save Changes
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TabsContent>

                        <TabsContent value="discipline">
                          {childRecords.disciplinary.length > 0 ? (
                            <div className="space-y-2">
                              {childRecords.disciplinary.map((record: any) => (
                                <div key={record.id} className="p-3 border border-destructive/20 rounded">
                                  <div className="flex justify-between items-start">
                                    <Badge variant="destructive">{record.incident_type}</Badge>
                                    <span className="text-sm text-muted-foreground">
                                      {new Date(record.incident_date).toLocaleDateString()}
                                    </span>
                                  </div>
                                  {record.description && <p className="mt-2 text-sm">{record.description}</p>}
                                  {record.action_taken && <p className="mt-1 text-sm"><strong>Action:</strong> {record.action_taken}</p>}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No disciplinary records</p>
                          )}
                        </TabsContent>

                        <TabsContent value="promotion">
                          {childRecords.promotion.length > 0 ? (
                            <div className="space-y-2">
                              {childRecords.promotion.map((record: any) => (
                                <div key={record.id} className="p-3 bg-muted rounded">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-medium">
                                        {record.from_class?.name} → {record.to_class?.name}
                                      </p>
                                      <p className="text-sm text-muted-foreground">{record.academic_year}</p>
                                    </div>
                                    <Badge variant={record.status === 'promoted' ? 'default' : 'secondary'}>
                                      {record.status}
                                    </Badge>
                                  </div>
                                  {record.remarks && <p className="mt-2 text-sm">{record.remarks}</p>}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No promotion records</p>
                          )}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No children enrolled yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Admission Applications</h3>
            <Dialog open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Application
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Admission Application</DialogTitle>
                  <DialogDescription>
                    Apply for your child's enrollment
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Child's Full Name</Label>
                    <Input 
                      value={applicationForm.applicant_name}
                      onChange={(e) => setApplicationForm({...applicationForm, applicant_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Input 
                      type="date"
                      value={applicationForm.date_of_birth}
                      onChange={(e) => setApplicationForm({...applicationForm, date_of_birth: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Additional Notes</Label>
                    <Textarea 
                      value={applicationForm.notes}
                      onChange={(e) => setApplicationForm({...applicationForm, notes: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleCreateApplication} className="w-full">
                    Submit Application
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {applications && applications.length > 0 ? (
            <div className="space-y-3">
              {applications.map((app: any) => (
                <Card key={app.id}>
                  <CardContent className="py-4">
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
                    {app.notes && <p className="mt-2 text-sm">{app.notes}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No applications submitted</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentDashboard;
