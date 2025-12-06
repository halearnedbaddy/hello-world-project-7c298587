import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  section: string;
  rollNumber: string;
  address: string;
  dateOfBirth: string;
  admissionDate: string;
  status: "active" | "inactive";
}

const Students = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data - will be replaced with real data from backend
  const mockStudents: Student[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@school.edu",
      phone: "+1234567890",
      class: "Grade 10",
      section: "A",
      rollNumber: "2024001",
      address: "123 Main St, City",
      dateOfBirth: "2008-05-15",
      admissionDate: "2020-04-01",
      status: "active"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@school.edu",
      phone: "+1234567891",
      class: "Grade 10",
      section: "A",
      rollNumber: "2024002",
      address: "456 Oak Ave, City",
      dateOfBirth: "2008-08-22",
      admissionDate: "2020-04-01",
      status: "active"
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "michael.brown@school.edu",
      phone: "+1234567892",
      class: "Grade 9",
      section: "B",
      rollNumber: "2024003",
      address: "789 Pine Rd, City",
      dateOfBirth: "2009-03-10",
      admissionDate: "2021-04-01",
      status: "active"
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah.wilson@school.edu",
      phone: "+1234567893",
      class: "Grade 11",
      section: "A",
      rollNumber: "2024004",
      address: "321 Elm St, City",
      dateOfBirth: "2007-12-05",
      admissionDate: "2019-04-01",
      status: "active"
    },
    {
      id: "5",
      name: "David Lee",
      email: "david.lee@school.edu",
      phone: "+1234567894",
      class: "Grade 9",
      section: "A",
      rollNumber: "2024005",
      address: "654 Maple Ave, City",
      dateOfBirth: "2009-07-18",
      admissionDate: "2021-04-01",
      status: "active"
    },
    {
      id: "6",
      name: "Emily Chen",
      email: "emily.chen@school.edu",
      phone: "+1234567895",
      class: "Grade 10",
      section: "B",
      rollNumber: "2024006",
      address: "987 Oak Rd, City",
      dateOfBirth: "2008-09-30",
      admissionDate: "2020-04-01",
      status: "active"
    }
  ];

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.includes(searchQuery) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage student profiles, records, and academic information
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, roll number, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Students</p>
              <p className="text-3xl font-bold text-foreground">{mockStudents.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Students</p>
              <p className="text-3xl font-bold text-foreground">
                {mockStudents.filter(s => s.status === "active").length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">New This Month</p>
              <p className="text-3xl font-bold text-foreground">0</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Students List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xl">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {student.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Roll No: {student.rollNumber}
                  </p>
                  <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {student.class} - Section {student.section}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{student.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{student.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{student.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>DOB: {new Date(student.dateOfBirth).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card className="p-12 text-center">
          <GraduationCap className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2 text-foreground">No students found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or add a new student.
          </p>
        </Card>
      )}
    </div>
  );
};

export default Students;
