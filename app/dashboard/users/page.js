"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Eye, Edit, Trash2, UserPlus, Shield, User, Mail, Phone, RefreshCw,  Calendar, } from "lucide-react"
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
import { fetchUsers, addUser, deleteUser, updateUser, setSearchTerm, setRoleFilter, setStatusFilter } from "@/lib/features/users/usersSlice"
import UserEditForm from "@/components/user-edit-form"
import { toast } from "sonner"
import { formatDate } from "@/lib/helper"
export default function UsersPage() {
  const dispatch = useDispatch()
  const users = useSelector((state) => state.users.filteredUsers)
  const loading = useSelector((state) => state.users.loading)
  const error = useSelector((state) => state.users.error)
  const searchTerm = useSelector((state) => state.users.searchTerm)
  const roleFilter = useSelector((state) => state.users.roleFilter)
  const statusFilter = useSelector((state) => state.users.statusFilter)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  // Get current user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }
  }, [])

  // Load users data
  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  // Check if a user is the current user
  const isCurrentUser = (user) => {
    if (!currentUser || !user) return false
    return (user._id === currentUser._id) || (user.email === currentUser.email)
  }

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
console.log(users)
//   const filteredUsers = users.filter((user) => {
//     const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
//     const matchesSearch =
//       fullName.includes(searchTerm.toLowerCase()) ||
//       (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (user._id || "").toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesRole = roleFilter === "all" || user.role === roleFilter;
//     const matchesStatus = statusFilter === "all" || user.status === statusFilter;
//     if(matchesRole || matchesSearch || matchesStatus){
//       return matchesSearch && matchesRole && matchesStatus;
//     }else{
//       return users
//     }
    
//   })
// console.log(filteredUsers)
  // Handlers for filters
  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value))
  }
  const handleRoleChange = (value) => {
    dispatch(setRoleFilter(value))
  }
  const handleStatusChange = (value) => {
    dispatch(setStatusFilter(value))
  }
  const handleRefresh = () => {
    dispatch(fetchUsers())
  }
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
      await dispatch(addUser(userData)).unwrap()
      toast.success("User created successfully")
      dispatch(fetchUsers())
    } catch (err) {
      console.error("Error creating user:", err)
      // Provide more specific error messages
      if (err.message?.includes("duplicate") || err.message?.includes("User already exists!")) {
        toast.error("User with this email already exists")
      } else if (err.message?.includes("validation")) {
        toast.error("Please check your input data")
      } else {
        toast.error("Failed to create user. Please try again.")
      }
    }
  }
  const handleDeleteUserRedux = async (id) => {
    try {
      await dispatch(deleteUser(id)).unwrap()
      toast.success("User deleted successfully")
      dispatch(fetchUsers())
    } catch (err) {
      toast.error("Failed to delete user")
    }
  }
  const handleEditUser = (user) => {
    setSelectedUser(user)
    setShowEditForm(true)
  }
  const handleUpdateUser = async (userData) => {
    try {
      const userId = selectedUser._id || selectedUser.id
      await dispatch(updateUser({ id: userId, userData })).unwrap()
      toast.success("User updated successfully")
      dispatch(fetchUsers())
    } catch (err) {
      toast.error("Failed to update user")
      throw err
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
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
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
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleCreateUser(formData);
              }}>
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
            <div className="text-2xl font-bold">{users?.filter((u) => u?.status === "Active").length || 0}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Technicians</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.filter((u) => u?.role === "Technician").length || 0}</div>
            <p className="text-xs text-muted-foreground">Field technicians</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.filter((u) => u?.role === "Admin").length || 0}</div>
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
                  onChange={handleSearchChange}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={handleRoleChange}>
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
            <Select value={statusFilter} onValueChange={handleStatusChange}>
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
          <CardTitle>Users ({users.length})</CardTitle>
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
              {users.map((user) => (
                (user)?<TableRow key={user.id || user._id ||`${Math.random()}`}>
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
                      {isCurrentUser(user) && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          My account
                        </span>
                      )}
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
                      <Phone className="h-3 w-3 text-muted-foreground" />
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
                 <div className="flex items-center flex-row gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatDate(user.joinDate)}</span>
                 </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteUserRedux(user._id || user.id)} disabled={isCurrentUser(user)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>:null
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <UserEditForm
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onSubmit={handleUpdateUser}
      />
    </div>
  )
}
