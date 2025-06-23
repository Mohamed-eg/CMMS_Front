"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
  setSearchTerm,
  setRoleFilter,
  setTechnicianTypeFilter,
  setStatusFilter,
  setSelectedUser,
  setShowAddDialog,
  setShowEditDialog,
  clearFilters,
} from "@/lib/features/users/usersSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Eye, Edit, Trash2, UserPlus, Shield, User, Mail, Phone, X, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const TECHNICIAN_TYPES = ["Electrician", "Extension Tech", "General Plumbing Tech", "Pump Maintenance Tech"]

export default function UsersPage() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const { users, filteredUsers, loading, error, filters, selectedUser, showAddDialog, showEditDialog } = useAppSelector(
    (state) => state.users,
  )

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    technicianType: "",
    status: "Active",
    department: "",
    skills: "",
    certifications: "",
  })

  const [editUser, setEditUser] = useState({})

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleSearchChange = (value) => {
    dispatch(setSearchTerm(value))
  }

  const handleRoleFilterChange = (value) => {
    dispatch(setRoleFilter(value))
  }

  const handleTechnicianTypeFilterChange = (value) => {
    dispatch(setTechnicianTypeFilter(value))
  }

  const handleStatusFilterChange = (value) => {
    dispatch(setStatusFilter(value))
  }

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      await dispatch(
        addUser({
          ...newUser,
          skills: newUser.skills
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s),
          certifications: newUser.certifications
            .split(",")
            .map((c) => c.trim())
            .filter((c) => c),
        }),
      ).unwrap()

      setNewUser({
        name: "",
        email: "",
        phone: "",
        role: "",
        technicianType: "",
        status: "Active",
        department: "",
        skills: "",
        certifications: "",
      })

      toast({
        title: "Success",
        description: "User added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      })
    }
  }

  const handleEditUser = async () => {
    try {
      await dispatch(
        updateUser({
          id: selectedUser.id,
          userData: {
            ...editUser,
            skills:
              typeof editUser.skills === "string"
                ? editUser.skills
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s)
                : editUser.skills,
            certifications:
              typeof editUser.certifications === "string"
                ? editUser.certifications
                    .split(",")
                    .map((c) => c.trim())
                    .filter((c) => c)
                : editUser.certifications,
          },
        }),
      ).unwrap()

      toast({
        title: "Success",
        description: "User updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await dispatch(deleteUser(userId)).unwrap()
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        })
      }
    }
  }

  const openEditDialog = (user) => {
    dispatch(setSelectedUser(user))
    setEditUser({
      ...user,
      skills: Array.isArray(user.skills) ? user.skills.join(", ") : user.skills,
      certifications: Array.isArray(user.certifications) ? user.certifications.join(", ") : user.certifications,
    })
    dispatch(setShowEditDialog(true))
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

  const getTechnicianTypeColor = (type) => {
    switch (type) {
      case "Electrician":
        return "bg-yellow-100 text-yellow-800"
      case "Extension Tech":
        return "bg-purple-100 text-purple-800"
      case "General Plumbing Tech":
        return "bg-blue-100 text-blue-800"
      case "Pump Maintenance Tech":
        return "bg-orange-100 text-orange-800"
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

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading users...</span>
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
          <Button variant="outline" onClick={() => dispatch(clearFilters())}>
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
          <Button onClick={() => dispatch(setShowAddDialog(true))}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
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
            <CardTitle className="text-sm font-medium">Electricians</CardTitle>
            <User className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.technicianType === "Electrician").length}</div>
            <p className="text-xs text-muted-foreground">Electrical specialists</p>
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
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={filters.searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filters.roleFilter} onValueChange={handleRoleFilterChange}>
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

            {filters.roleFilter === "Technician" && (
              <Select value={filters.technicianTypeFilter} onValueChange={handleTechnicianTypeFilterChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by technician type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technician Types</SelectItem>
                  {TECHNICIAN_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={filters.statusFilter} onValueChange={handleStatusFilterChange}>
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
                <TableHead>Technician Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.id}</p>
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
                    {user.technicianType ? (
                      <Badge className={getTechnicianTypeColor(user.technicianType)}>{user.technicianType}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user.department}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user.lastLogin || "Never"}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
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

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => dispatch(setShowAddDialog(open))}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account for your gas station staff.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Ahmed Al-Rashid"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="user@gasstation.sa"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="+966 50 123 4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  placeholder="Maintenance"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) =>
                    setNewUser({
                      ...newUser,
                      role: value,
                      technicianType: value !== "Technician" ? "" : newUser.technicianType,
                    })
                  }
                >
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
              {newUser.role === "Technician" && (
                <div className="space-y-2">
                  <Label htmlFor="technicianType">Technician Type</Label>
                  <Select
                    value={newUser.technicianType}
                    onValueChange={(value) => setNewUser({ ...newUser, technicianType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select technician type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TECHNICIAN_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                value={newUser.skills}
                onChange={(e) => setNewUser({ ...newUser, skills: e.target.value })}
                placeholder="Electrical Systems, Panel Wiring, Motor Control"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certifications">Certifications (comma-separated)</Label>
              <Input
                id="certifications"
                value={newUser.certifications}
                onChange={(e) => setNewUser({ ...newUser, certifications: e.target.value })}
                placeholder="Electrical Safety, High Voltage Systems"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => dispatch(setShowAddDialog(false))}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={(open) => dispatch(setShowEditDialog(open))}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and permissions.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editUser.name || ""}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editUser.email || ""}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editUser.phone || ""}
                  onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  value={editUser.department || ""}
                  onChange={(e) => setEditUser({ ...editUser, department: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={editUser.role || ""}
                  onValueChange={(value) =>
                    setEditUser({
                      ...editUser,
                      role: value,
                      technicianType: value !== "Technician" ? "" : editUser.technicianType,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Technician">Technician</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editUser.role === "Technician" && (
                <div className="space-y-2">
                  <Label htmlFor="edit-technicianType">Technician Type</Label>
                  <Select
                    value={editUser.technicianType || ""}
                    onValueChange={(value) => setEditUser({ ...editUser, technicianType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TECHNICIAN_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editUser.status || ""}
                  onValueChange={(value) => setEditUser({ ...editUser, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-skills">Skills (comma-separated)</Label>
              <Input
                id="edit-skills"
                value={editUser.skills || ""}
                onChange={(e) => setEditUser({ ...editUser, skills: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-certifications">Certifications (comma-separated)</Label>
              <Input
                id="edit-certifications"
                value={editUser.certifications || ""}
                onChange={(e) => setEditUser({ ...editUser, certifications: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => dispatch(setShowEditDialog(false))}>
              Cancel
            </Button>
            <Button onClick={handleEditUser} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
