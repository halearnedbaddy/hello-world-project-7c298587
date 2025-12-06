import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  FileText,
  DollarSign,
  Bell,
  BarChart,
  UserCheck,
  TrendingUp,
  ClipboardList,
  MessageSquare,
  LayoutDashboard
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    available: true
  },
  {
    title: "Students",
    url: "/students",
    icon: GraduationCap,
    available: true
  },
  {
    title: "Teachers",
    url: "/teachers",
    icon: Users,
    available: false
  },
  {
    title: "Classes",
    url: "/classes",
    icon: BookOpen,
    available: false
  },
  {
    title: "Subjects",
    url: "/subjects",
    icon: BookOpen,
    available: false
  },
  {
    title: "Attendance",
    url: "/attendance",
    icon: UserCheck,
    available: false
  },
  {
    title: "Exams",
    url: "/exams",
    icon: ClipboardList,
    available: true
  },
  {
    title: "Results",
    url: "/results",
    icon: FileText,
    available: true
  },
  {
    title: "Fees",
    url: "/fees",
    icon: DollarSign,
    available: false
  },
  {
    title: "Timetable",
    url: "/timetable",
    icon: Calendar,
    available: false
  },
  {
    title: "Notices",
    url: "/notices",
    icon: Bell,
    available: false
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
    available: false
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart,
    available: false
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: TrendingUp,
    available: false
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="bg-black border-r border-gray-800">
      <SidebarContent className="bg-black">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-400">
            {!isCollapsed && "System Modules"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    {item.available ? (
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <NavLink
                          to={item.url}
                          end={item.url === "/"}
                          className={({ isActive }) =>
                            `flex items-center gap-3 ${
                              isActive
                                ? "bg-primary text-white font-medium"
                                : "text-gray-300 hover:bg-gray-900 hover:text-white"
                            }`
                          }
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton tooltip={item.title} disabled>
                        <Icon className="w-4 h-4 shrink-0" />
                        {!isCollapsed && (
                          <div className="flex items-center justify-between w-full">
                            <span>{item.title}</span>
                            <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">
                              Soon
                            </span>
                          </div>
                        )}
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
