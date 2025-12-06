import { useAuth } from '@/contexts/AuthContext';
import { useAdminData } from '@/hooks/useAdminData';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, BookOpen, LogOut, GraduationCap, FileText, TrendingUp
} from 'lucide-react';

const HeadteacherDashboard = () => {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const { students, classes, subjects, applications, promotions, isLoading } = useAdminData();

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
          <h1 className="text-3xl font-bold text-foreground">Headteacher Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {profile?.full_name || 'Headteacher'}</p>
        </div>
        <Button onClick={signOut} variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              Pending Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{applications?.filter((a: any) => a.status === 'pending').length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Promotions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{promotions?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {applications?.slice(0, 5).map((app: any) => (
                  <div key={app.id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <span>{app.applicant_name}</span>
                    <Badge variant={app.status === 'approved' ? 'default' : 'secondary'}>{app.status}</Badge>
                  </div>
                )) || <p className="text-muted-foreground">No applications</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Promotions</CardTitle>
              </CardHeader>
              <CardContent>
                {promotions?.slice(0, 5).map((p: any) => (
                  <div key={p.id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <span>{p.academic_year}</span>
                    <Badge variant={p.status === 'promoted' ? 'default' : 'secondary'}>{p.status}</Badge>
                  </div>
                )) || <p className="text-muted-foreground">No promotions</p>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>All Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {students?.slice(0, 10).map((s: any) => (
                  <div key={s.id} className="flex justify-between items-center p-3 bg-muted rounded">
                    <div>
                      <p className="font-medium">{s.profile?.full_name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">Class: {s.class?.name || 'Unassigned'}</p>
                    </div>
                    <Badge>{s.enrollment_status}</Badge>
                  </div>
                )) || <p className="text-muted-foreground">No students</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classes?.map((c: any) => (
              <Card key={c.id}>
                <CardHeader>
                  <CardTitle>{c.name} {c.section && `- ${c.section}`}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Year: {c.academic_year}</p>
                  <p className="text-sm">Students: {students?.filter((s: any) => s.class_id === c.id).length || 0}</p>
                </CardContent>
              </Card>
            )) || <p className="text-muted-foreground">No classes</p>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HeadteacherDashboard;
