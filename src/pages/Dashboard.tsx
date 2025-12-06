import { Card } from "@/components/ui/card";
import { 
  Users, 
  GraduationCap, 
  BookOpen,
  TrendingUp,
  Calendar,
  DollarSign,
  UserCheck,
  Award
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    { 
      label: "Total Students", 
      value: "1,234", 
      change: "+12%", 
      trend: "up",
      icon: GraduationCap,
      color: "from-blue-500 to-blue-600"
    },
    { 
      label: "Total Teachers", 
      value: "89", 
      change: "+5%", 
      trend: "up",
      icon: Users,
      color: "from-green-500 to-green-600"
    },
    { 
      label: "Total Classes", 
      value: "42", 
      change: "0%", 
      trend: "neutral",
      icon: BookOpen,
      color: "from-purple-500 to-purple-600"
    },
    { 
      label: "Attendance Today", 
      value: "94%", 
      change: "+2%", 
      trend: "up",
      icon: UserCheck,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const recentActivity = [
    {
      title: "New Student Admission",
      description: "John Doe admitted to Grade 10-A",
      time: "2 hours ago",
      type: "admission"
    },
    {
      title: "Exam Scheduled",
      description: "Mid-term exam scheduled for Grade 9",
      time: "4 hours ago",
      type: "exam"
    },
    {
      title: "Fee Payment Received",
      description: "Payment of $500 from Jane Smith",
      time: "5 hours ago",
      type: "payment"
    },
    {
      title: "Notice Published",
      description: "Annual Sports Day announcement",
      time: "1 day ago",
      type: "notice"
    }
  ];

  const upcomingEvents = [
    {
      title: "Parent-Teacher Meeting",
      date: "Nov 5, 2025",
      time: "10:00 AM",
      icon: Users
    },
    {
      title: "Annual Sports Day",
      date: "Nov 10, 2025",
      time: "9:00 AM",
      icon: Award
    },
    {
      title: "Mid-Term Exams Start",
      date: "Nov 15, 2025",
      time: "8:00 AM",
      icon: BookOpen
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome Back!</h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your school today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-red-600' : 
                  'text-muted-foreground'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'admission' ? 'bg-blue-500' :
                  activity.type === 'exam' ? 'bg-purple-500' :
                  activity.type === 'payment' ? 'bg-green-500' :
                  'bg-orange-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">{activity.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Upcoming Events</h2>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => {
              const Icon = event.icon;
              return (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground text-sm">{event.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{event.date}</p>
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Fee Collection</p>
              <p className="text-2xl font-bold text-foreground">$45,230</p>
              <p className="text-xs text-green-600 mt-1">+18% from last month</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Exams</p>
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-xs text-muted-foreground mt-1">Ongoing this week</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Average Performance</p>
              <p className="text-2xl font-bold text-foreground">87%</p>
              <p className="text-xs text-green-600 mt-1">+3% improvement</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
