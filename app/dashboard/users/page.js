"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Eye, Edit, Trash2, UserPlus, Shield, User, Mail, phone, RefreshCw } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { fetchUsers, createUser, deleteUser } from "@/lib/api/users"
import { toast } from "sonner"

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [users, setUsers] = useState([])
  const [userStats, setUserStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Default fallback data
  const defaultUsers = [
    {
      id: "USR-001",
      firstName: "Ahmed",
      lastName: "Al-Rashid",
      station_Name: "Al-Noor Gas Station - Riyadh",
      email: "ahmed.rashid@gasstation.sa",
      phone: "+966 50 123 4567",
      role: "Admin",
      joinDate: "2023-01-15",
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "USR-002",
      firstName: "Mohammed",
      lastName: "Al-Fahad",
      station_Name: "Al-Noor Gas Station - Riyadh",
      email: "mohammed.fahad@gasstation.sa",
      phone: "+966 55 234 5678",
      role: "Technician",
      joinDate: "2023-03-20",
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "USR-003",
      firstName: "Abdullah",
      lastName: "Al-Rashid",
      station_Name: "Al-Noor Gas Station - Riyadh",
      email: "abdullah.rashid@gasstation.sa",
      phone: "+966 56 345 6789",
      role: "Manager",
      joinDate: "2023-02-10",
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "USR-004",
      firstName: "Khalid",
      lastName: "Al-Mutairi",
      station_Name: "Al-Noor Gas Station - Riyadh",
      email: "khalid.mutairi@gasstation.sa",
      phone: "+966 54 456 7890",
      role: "Technician",
      joinDate: "2023-05-12",
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "USR-005",
      firstName: "Omar",
      lastName: "Al-Zahra",
      Station_Name: "Al-Noor Gas Station - Riyadh",
      email: "omar.zahra@gasstation.sa",
      phone: "+966 53 567 8901",
      role: "Technician",
      joinDate: "2023-08-05",
      status: "Inactive",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Load users data
  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const filters = {
        search: searchTerm,
        role: roleFilter,
        status: statusFilter,
      }
//if you want to fetch user stats add fetchUserStats() to the array
      const [usersData, statsData] = await Promise.all([fetchUsers(filters)])

      setUsers(usersData.users || usersData || [])
      setUserStats(statsData || {})
      toast.success("Users loaded successfully")
    } catch (err) {
      console.error("Error loading users:", err)
      setError(err.message)
      setUsers(defaultUsers) // Use fallback data
      toast.error("Failed to load users, showing cached data")
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount and when filters change
  useEffect(() => {
    // Comment out API call for now until backend is ready
    loadUsers()

    // Use default data for now
    setUsers(defaultUsers)
    setLoading(false)
  }, [searchTerm, roleFilter, statusFilter])

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800"
      case "Manager":
        return "bg-blue-100 text-blue-800"
      case "Technician":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      case "Suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "Admin":
        return <Shield className="h-4 w-4" />
      case "Manager":
        return <User className="h-4 w-4" />
      case "Technician":
        return <User className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user._id || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  })

  const handleCreateUser = async (formData) => {
    try {
      const userData = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        role: formData.get("role"),
        status: formData.get("status"),
        station_Name: formData.get("station_Name"),
        password: formData.get("password"),
      }

      // Comment out API call for now
      await createUser(userData)

      toast.success("User created successfully")
      loadUsers() // Refresh the list
    } catch (err) {
      console.error("Error creating user:", err)
      toast.error("Failed to create user")
    }
  }

  const handleDeleteUser = async (id) => {
    try {
      // Comment out API call for now
      await deleteUser(id)

      toast.success("User deleted successfully")
      loadUsers() // Refresh the list
    } catch (err) {
      console.error("Error deleting user:", err)
      toast.error("Failed to delete user")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading users...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions for your gas station</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadUsers} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Create a new user account for your gas station staff.</DialogDescription>
              </DialogHeader>
              <form action={handleCreateUser}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" placeholder="Ahmed" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" placeholder="Al-Rashid" required />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="station_Name">Station Name</Label>
                      <Input id="station_Name" name="station_Name" placeholder="Search station name... (type to search)" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="user@gasstation.sa" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">phone</Label>
                      <Input id="phone" name="phone" placeholder="+966 50 123 4567" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">role</Label>
                      <Select name="role" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Technician">Technician</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select name="status" defaultValue="Active" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Temporary Password</Label>
                    <Input id="password" name="password" type="password" placeholder="Temporary password" required />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit">Create User</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <span className="font-medium">API Error:</span>
              <span>{error}</span>
              <span className="text-sm">(Showing cached data)</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Technicians</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.role === "Technician").length}</div>
            <p className="text-xs text-muted-foreground">Field technicians</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.role === "Admin").length}</div>
            <p className="text-xs text-muted-foreground">System administrators</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Technician">Technician</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage all user accounts and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>status</TableHead>
                <TableHead>Station</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id || user._id ||`${Math.random()}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                        <AvatarFallback>
                          {`${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
                        <p className="text-sm text-muted-foreground">{user._id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{user.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user.station_Name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user.joinDate}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
