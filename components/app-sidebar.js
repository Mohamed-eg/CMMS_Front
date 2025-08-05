"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Wrench,
  Building2,
  Users,
  FileText,
  Calendar,
  Settings,
  BarChart3,
  User,
  LogOut,
  Bell,
  ChevronUp,
  Fuel,
  Shield,
  Activity,
} from "lucide-react"
import { use, useEffect, useState } from "react"
import { useSelector } from "react-redux"

// Navigation items
const navigationItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        description: "Main overview and statistics",
        badge: null,
      },
      {
        title: "Analytics",
        url: "/dashboard/reports",
        icon: BarChart3,
        description: "Performance metrics and insights",
        badge: null,
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
        description: "Maintenance requests and tasks",
        badge: { count: 12, variant: "destructive" },
      },
      {
        title: "Assets",
        url: "/dashboard/assets",
        icon: Fuel,
        description: "Equipment and infrastructure",
        badge: null,
      },
      {
        title: "Stations",
        url: "/dashboard/station-details",
        icon: Building2,
        description: "Gas station locations",
        badge: null,
      },
      {
        title: "Calendar",
        url: "/dashboard/calendar",
        icon: Calendar,
        description: "Scheduled maintenance",
        badge: { count: 3, variant: "secondary" },
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
        description: "Team and access management",
        badge: null,
      },
      {
        title: "Reports",
        url: "/dashboard/maintenance-reports",
        icon: FileText,
        description: "Maintenance documentation",
        badge: null,
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
        description: "System configuration",
        badge: null,
      },
    ],
  },
]

// User data (this would come from auth context in a real app)
export function AppSidebar({ ...props }) {
  const router = useRouter()
  const [userData,setUser] = useState({
    firstName: "Ahmed Al-Rashid",
    email: "ahmed.rashid@cmms.sa",
    role: "Maintenance Manager",
    avatar: "/placeholder-user.jpg",
    status: "online",
  })
  const workOrderCount = useSelector(state => state.workOrders?.workOrders?.length || 0)
  const assetCount = useSelector(state => state.assets?.assets?.length || 0)
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])
  const pathname = usePathname()

  // Get user role
  const userRole = userData.role?.toLowerCase() || userData.Role?.toLowerCase()
  const isTechnician = userRole === "technician"

  // Filter navigation items based on user role
  const getFilteredNavigationItems = () => {
    if (isTechnician) {
      // Technicians only see limited navigation
      return [
        {
          title: "Operations",
          items: [
            {
              title: "Work Orders",
              url: "/dashboard/technician",
              icon: Wrench,
              description: "View and manage your assigned work orders",
              badge: { count: workOrderCount, variant: "destructive" },
            },
          ],
        },
      ]
    }

    // Admin/Manager sees full navigation
    return navigationItems
  }

  const filteredNavItems = getFilteredNavigationItems()

  // Clone navigationItems and inject workOrderCount
  const navItemsWithCount = filteredNavItems.map(group => {
    if (group.title === "Operations") {
      return {
        ...group,
        items: group.items.map(item => {
          if (item.title === "Work Orders") {
            return { ...item, badge: { count: workOrderCount, variant: "destructive" } }
          }
          if (item.title === "Assets") {
            return { ...item, badge: { count: assetCount, variant: "secondary" } }
          }
          return item
        }),
      }
    }
    return group
  })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <div className={`${props.isOpen?"justify-center":null} flex items-center  gap-3 px-3 py-4`}>
          <div className={`${props.isOpen?"px-3":null} flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg`}>
            <Shield className="h-5 w-5" />
          </div>
          <div className={`flex flex-col ${props.isOpen?"hidden":null}`}>
            <span className={`text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
              CMMS Pro
            </span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-muted-foreground">System Online</span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-950/50">
        {navItemsWithCount.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider px-3">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}
                     className={`${props.isOpen?"justify-center":null}`}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`
                          group relative transition-all duration-300 ease-in-out
                          hover:scale-[1.02] hover:shadow-sm
                          ${props.isOpen?"justify-center":null}
                          ${
                            isActive
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border-l-4 border-l-blue-600"
                              : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950 dark:hover:to-indigo-950"
                          }
                        `}
                      >
                        <Link href={item.url} className={`flex items-center ${props.isOpen?"!justify-center":null} gap-3 w-full`}>
                          <div
                            className={`
                              flex  items-center justify-center rounded-lg transition-all duration-300
                              ${props.isOpen?"p-3":"!w-8 h-8"}
                              ${
                                isActive
                                  ? "bg-white/20 text-white shadow-inner"
                                  : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 group-hover:from-blue-100 group-hover:to-indigo-100 group-hover:text-blue-600 dark:from-gray-800 dark:to-gray-700 dark:text-gray-400"
                              }
                            `}
                          >
                            <item.icon className={`h-4 w-4 ${props.isOpen?"":null}` } />
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span
                                className={`
                                  font-medium text-sm truncate
                                  ${isActive ? "text-white" : "text-gray-900 dark:text-gray-100"}
                                `}
                              >
                                {item.title}
                              </span>
                              {item.badge && (
                                <Badge
                                  variant={item.badge.variant}
                                  className={`
                                    ml-2 h-5 px-1.5 text-xs font-medium
                                    ${
                                      isActive
                                        ? "bg-white/20 text-white border-white/30"
                                        : item.badge.variant === "destructive"
                                          ? "bg-red-100 text-red-700 border-red-200"
                                          : "bg-gray-100 text-gray-600 border-gray-200"
                                    }
                                  `}
                                >
                                  {item.badge.count}
                                </Badge>
                              )}
                            </div>
                            <span
                              className={`
                                text-xs truncate transition-opacity duration-300
                                ${isActive ? "text-white/80" : "text-muted-foreground group-hover:text-blue-600/80"}
                              `}
                            >
                              {item.description}
                            </span>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950 dark:hover:to-indigo-950 transition-all duration-300 hover:scale-[1.02] hover:shadow-sm"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                        <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.firstName} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-semibold">
                          {userData.firstName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white shadow-sm animate-pulse"></div>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0 text-left">
                      <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                        {userData.firstName}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">{userData.role || "user"}</span>
                    </div>
                    <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors duration-300" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 p-2 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl"
                side="top"
                align="end"
                sideOffset={8}
              >
                <DropdownMenuLabel className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                      <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.fullName} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-semibold">
                        {userData.firstName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{userData.firstName}</span>
                      <span className="text-sm text-muted-foreground">{userData.email}</span>
                      <Badge variant="secondary" className="w-fit mt-1 text-xs">
                        {userData.role}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-3 p-3 hover:bg-blue-50 transition-colors duration-200">
                  <User className="h-4 w-4 text-blue-600" />
                  <Link href="/dashboard/profile" className="flex-1">
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-3 p-3 hover:bg-blue-50 transition-colors duration-200">
                  <Bell className="h-4 w-4 text-blue-600" />
                  <span className="flex-1">Notifications</span>
                  <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                    3
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-3 p-3 hover:bg-blue-50 transition-colors duration-200">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="flex-1">Activity Log</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-3 p-3 hover:bg-red-50 text-red-600 transition-colors duration-200">
                  <LogOut className="h-4 w-4" />
                  <span className="flex-1">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* System Status */}
        <div className={`${props.isOpen?"hidden":null} px-3 py-2`}>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Version 2.1.0</span>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
