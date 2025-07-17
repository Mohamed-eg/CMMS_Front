"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Wrench,
} from "lucide-react"
import { WorkOrderForm } from "@/components/work-order-form"
import { toast } from "sonner"
import { fetchWorkOrders, deleteWorkOrders } from "@/lib/features/workOrders/workOrdersSlice"
//import { buildApiUrl, getAuthHeaders } from "@/lib/config/api"

export default function WorkOrdersPage() {
  const dispatch = useDispatch()
  const { workOrders, loading, error } = useSelector((state) => state.workOrders || {})
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock data for development
  const mockWorkOrders = [
    {
      _id: 1,
      title: "Pump 3 Maintenance",
      description: "Regular maintenance check for pump 3",
      status: "pending",
      priority: "medium",
      Requested_By: "John Smith",
      station: "Station A",
      createdAt: "2024-01-15T10:00:00Z",
      dueDate: "2024-01-20T10:00:00Z",
      equipment: "Fuel Pump #3",
    },
    {
      _id: 2,
      title: "Tank Level Sensor Repair",
      description: "Tank level sensor showing incorrect readings",
      status: "in-progress",
      priority: "high",
      Requested_By: "Sarah Johnson",
      station: "Station B",
      createdAt: "2024-01-14T14:30:00Z",
      dueDate: "2024-01-18T14:30:00Z",
      equipment: "Tank Level Sensor #2",
    },
    {
      _id: 3,
      title: "Canopy Light Replacement",
      description: "Replace burnt out LED lights in canopy",
      status: "completed",
      priority: "low",
      Requested_By: "Mike Wilson",
      station: "Station C",
      createdAt: "2024-01-10T09:00:00Z",
      dueDate: "2024-01-15T09:00:00Z",
      equipment: "Canopy Lighting",
    },
    {
      _id: 4,
      title: "POS System Update",
      description: "Update point of sale system software",
      status: "cancelled",
      priority: "medium",
      Requested_By: "Lisa Brown",
      station: "Station A",
      createdAt: "2024-01-12T11:00:00Z",
      dueDate: "2024-01-17T11:00:00Z",
      equipment: "POS Terminal #1",
    },
  ]

  useEffect(() => {
    dispatch(fetchWorkOrders())
  }, [dispatch])
  // Use mock data if Redux data is not available
  const currentWorkOrders = Array.isArray(workOrders) ? workOrders : mockWorkOrders

  // Filter work orders
  const filteredWorkOrders = currentWorkOrders.filter((workOrder) => {
    const title = workOrder?.title || ""
    const description = workOrder?.description || ""
    const status = (workOrder?.status || "").toString().toLowerCase()
    const priority = (workOrder?.priority || "").toString().toLowerCase()
    const Requested_By = workOrder?.Requested_By || ""
    const station = workOrder?.station || ""

    const matchesSearch =
      searchTerm === "" ||
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Requested_By.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || status === statusFilter.toLowerCase()
    const matchesPriority = priorityFilter === "all" || priority === priorityFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesPriority
  })

  // Calculate statistics
  const stats = {
    total: currentWorkOrders.length,
    pending: currentWorkOrders.filter((wo) => (wo?.status || "") === "pending").length,
    inProgress: currentWorkOrders.filter((wo) => (wo?.status || "") === "in-progress").length,
    completed: currentWorkOrders.filter((wo) => (wo?.status || "") === "completed").length,
    overdue: currentWorkOrders.filter((wo) => {
      const dueDate = wo?.dueDate ? new Date(wo.dueDate) : null
      return dueDate && dueDate < new Date() && (wo?.status || "") !== "completed"
    }).length,
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "in-progress":
        return <RefreshCw className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString()
    } catch (error) {
      return "Invalid Date"
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await dispatch(fetchWorkOrders()).unwrap();
      toast.success("Work orders refreshed successfully")
    } catch (error) {
      toast.error("Failed to refresh work orders")
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleDeleteWorkOrder = async (_id) => {
    try {
      await dispatch(deleteWorkOrders(_id)).unwrap();
      toast.success("Work order deleted successfully");
    } catch (error) {
      toast.error("Failed to delete work order");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work Orders</h1>
          <p className="text-muted-foreground">Manage and track maintenance work orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Work Order
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All work orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Successfully finished</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter work orders by status, priority, or search</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search work orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[120px] justify-between bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Status: {statusFilter === "all" ? "All" : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Statuses</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>In Progress</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("completed")}>Completed</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>Cancelled</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[120px] justify-between bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Priority: {priorityFilter === "all" ? "All" : priorityFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setPriorityFilter("all")}>All Priorities</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter("high")}>High Priority</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>Medium Priority</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter("low")}>Low Priority</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Work Orders ({filteredWorkOrders.length})</CardTitle>
          <CardDescription>
            {filteredWorkOrders.length === 0
              ? "No work orders found matching your criteria"
              : `Showing ${filteredWorkOrders.length} of ${currentWorkOrders.length} work orders`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading work orders...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-red-600">
              <AlertCircle className="h-8 w-8 mr-2" />
              <span>Error loading work orders: {error}</span>
            </div>
          ) : filteredWorkOrders.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Wrench className="h-8 w-8 mr-2" />
              <span>No work orders found</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Station</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkOrders.map((workOrder) => (
                    <TableRow key={workOrder?._id || Math.random()}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{workOrder?.title || "Untitled"}</div>
                          <div className="text-sm text-muted-foreground">
                            {workOrder?.equipment || "No equipment specified"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(workOrder?.status || "")} flex items-center gap-1 w-fit`}
                        >
                          {getStatusIcon(workOrder?.status || "")}
                          {workOrder?.status || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getPriorityColor(workOrder?.priority || "")} w-fit`}>
                          {workOrder?.priority || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>{workOrder?.Requested_By || "Unassigned"}</TableCell>
                      <TableCell>{workOrder?.station || "N/A"}</TableCell>
                      <TableCell>{formatDate(workOrder?.dueDate)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Work Order</DropdownMenuItem>
                            <DropdownMenuItem>Assign Technician</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleDeleteWorkOrder(workOrder?._id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Work Order Form Modal */}
      {showForm && (
        <WorkOrderForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={(data) => {
            console.log("Work order submitted:", data)
            setShowForm(false)
            toast.success("Work order created successfully")
          }}
        />
      )}
    </div>
  )
}
