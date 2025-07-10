"use client"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Wrench,
  Building2,
  Users,
  FileText,
  Calendar,
  Settings,
  HelpCircle,
  LogOut,
  User,
  Bell,
  ChevronUp,
  Fuel,
  BarChart3,
} from "lucide-react"

// Navigation data
const data = {
  user: {
    name: "Ahmed Al-Rashid",
    email: "ahmed@gasstation.com",
    avatar: "/placeholder-user.jpg",
    role: "Station Manager",
    status: "online",
  },
  navMain: [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
          description: "Main overview and analytics",
          isActive: true,
        },
        {
          title: "Station Details",
          url: "/dashboard/station-details",
          icon: Building2,
          description: "Station information and status",
        },
      ],
    },
    {
      title: "Operations",
      items: [
        {
          title: "Work Orders",
          url: "/dashboard/work-orders",
          icon: Wrench,
          description: "Maintenance and repair tasks",
          badge: "12",
        },
        {
          title: "Assets",
          url: "/dashboard/assets",
          icon: Fuel,
          description: "Equipment and asset management",
        },
        {
          title: "Calendar",
          url: "/dashboard/calendar",
          icon: Calendar,
          description: "Scheduled maintenance and events",
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          title: "Users",
          url: "/dashboard/users",
          icon: Users,
          description: "Staff and user management",
        },
        {
          title: "Reports",
          url: "/dashboard/reports",
          icon: FileText,
          description: "Analytics and reporting",
        },
        {
          title: "Maintenance Reports",
          url: "/dashboard/maintenance-reports",
          icon: BarChart3,
          description: "Maintenance analytics",
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          title: "Settings",
          url: "/dashboard/settings",
          icon: Settings,
          description: "System configuration",
        },
        {
          title: "Help & Support",
          url: "/dashboard/help",
          icon: HelpCircle,
          description: "Documentation and support",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-3 py-2">
          {/* Company Logo */}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg">
            <Fuel className="h-5 w-5" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <div className="text-sm font-semibold text-foreground">CMMS Gas Station</div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-muted-foreground">System Online</span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`
                          relative group transition-all duration-300 ease-in-out
                          hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50
                          hover:border-l-4 hover:border-l-blue-500
                          hover:shadow-sm hover:scale-[1.02]
                          ${
                            isActive
                              ? "bg-gradient-to-r from-blue-100 to-indigo-100 border-l-4 border-l-blue-600 shadow-md text-blue-900 font-medium"
                              : "hover:text-blue-700"
                          }
                        `}
                      >
                        <a href={item.url} className="flex items-center gap-3 w-full">
                          <div
                            className={`
                              flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300
                              ${
                                isActive
                                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg"
                                  : "bg-muted/50 text-muted-foreground group-hover:bg-blue-100 group-hover:text-blue-600"
                              }
                            `}
                          >
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{item.title}</span>
                              {item.badge && (
                                <Badge
                                  variant="secondary"
                                  className="h-5 px-1.5 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground group-hover:text-blue-600/70">
                              {item.description}
                            </span>
                          </div>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-8 w-8 border-2 border-blue-200">
                        <AvatarImage src={data.user.avatar || "/placeholder.svg"} alt={data.user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm font-medium">
                          {data.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                      <span className="truncate font-semibold">{data.user.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{data.user.role}</span>
                    </div>
                  </div>
                  <ChevronUp className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={data.user.avatar || "/placeholder.svg"} alt={data.user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                        {data.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{data.user.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{data.user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-blue-50 cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <a href="/dashboard/profile">Profile</a>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-blue-50 cursor-pointer">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-blue-50 cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-red-50 text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* System Status */}
        <div className="px-3 py-2 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Version 2.1.0</span>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
