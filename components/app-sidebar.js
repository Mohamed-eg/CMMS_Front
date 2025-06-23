"use client"

import {
  Calendar,
  Home,
  Settings,
  Users,
  Wrench,
  Package,
  Bell,
  ClipboardList,
  TrendingUp,
  Building2,
  FileText,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import Link from "next/link"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Work Orders",
    url: "/dashboard/work-orders",
    icon: ClipboardList,
  },
  {
    title: "Assets",
    url: "/dashboard/assets",
    icon: Package,
  },
  {
    title: "Station Details",
    url: "/dashboard/station-details",
    icon: Building2,
  },
  {
    title: "Maintenance Reports",
    url: "/dashboard/maintenance-reports",
    icon: FileText,
  },
  {
    title: "Maintenance",
    url: "/dashboard/maintenance",
    icon: Wrench,
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: TrendingUp,
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Notifications",
    url: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Wrench className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">CMMS</h2>
            <p className="text-xs text-muted-foreground">Gas Station KSA</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2 text-xs text-muted-foreground">© 2024 Gas Station CMMS</div>
      </SidebarFooter>
    </Sidebar>
  )
}
