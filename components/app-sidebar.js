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
import { usePathname } from "next/navigation"

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
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-xl shadow-lg">
            <Wrench className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-900">CMMS</h2>
            <p className="text-sm text-blue-600 font-medium">Gas Station KSA</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`
                        group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }
                        hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3 w-full">
                        <item.icon
                          className={`
                          h-5 w-5 transition-colors duration-200
                          ${isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"}
                        `}
                        />
                        <span className="truncate">{item.title}</span>
                        {isActive && (
                          <div className="absolute right-2 w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 bg-gray-50/50">
        <div className="p-4 text-center">
          <p className="text-xs text-gray-500 font-medium">© 2024 Gas Station CMMS</p>
          <p className="text-xs text-gray-400 mt-1">Version 2.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
