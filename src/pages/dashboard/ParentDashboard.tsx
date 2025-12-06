import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { FileText, User, Calendar, LogOut } from 'lucide-react';

const ParentDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Parent Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user?.email}</p>
        </div>
        <Button onClick={signOut} variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/results')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Child's Results
            </CardTitle>
            <CardDescription>View your child's academic performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">View Results</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Child's Profile
            </CardTitle>
            <CardDescription>Access student information</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">View Profile</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/exams')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Exam Schedule
            </CardTitle>
            <CardDescription>Check upcoming examinations</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">View Schedule</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParentDashboard;
