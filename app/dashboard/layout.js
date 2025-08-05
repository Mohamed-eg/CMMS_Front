"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { LogOut, User, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isSideOpen, setIsSideOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const userObj = JSON.parse(userData)
    setUser(userObj)

    // Check user role and redirect accordingly
    const userRole = userObj.role?.toLowerCase() || userObj.Role?.toLowerCase()
    
    if (userRole === "technician") {
      // Redirect technicians to their dedicated page
      if (window.location.pathname !== "/dashboard/technician") {
        router.push("/dashboard/technician")
        return
      }
    } else if (userRole === "admin" || userRole === "manager" || userRole === "maintenance manager") {
      // Admin/Manager can access full dashboard
      if (window.location.pathname === "/dashboard/technician") {
        router.push("/dashboard")
        return
      }
    }

    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("authToken")
    router.push("/login")
  }

  const handleProfileClick = () => {
    setIsOpen(false)
    router.push("/dashboard/profile")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Check if user is technician
  const userRole = user.role?.toLowerCase() || user.Role?.toLowerCase()
  const isTechnician = userRole === "technician"

  // If technician, render technician layout
  if (isTechnician) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="flex justify-between items-center px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                <User className="h-4 w-4" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Technician Portal</h1>
                <p className="text-sm text-muted-foreground">Work Order Management</p>
              </div>
            </div>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <User className="h-4 w-4" />
                  {user.firstName || user.FirstName || "Technician"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 z-100" sideOffset={5}>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </div>
    )
  }

  // Admin/Manager layout with full sidebar
  return (
    <SidebarProvider>
      <AppSidebar isOpen={isSideOpen} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger onClick={()=>{setIsSideOpen(!isSideOpen)}} className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1">
            <h1 className="font-semibold">Gas Station CMMS</h1>
          </div>
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsOpen(!isOpen)}
              >
                <User className="h-4 w-4" />
                {user.firstName || user.FirstName || "User"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 z-100" sideOffset={5}>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
