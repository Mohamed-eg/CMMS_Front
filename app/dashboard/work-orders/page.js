"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import {
  Plus,
  Search,
  RefreshCw,
  Trash2,
  Edit,
  Eye,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import WorkOrderForm from "@/components/work-order-form"
import { fetchWorkOrders, deleteWorkOrder } from "@/lib/features/workOrders/workOrdersSlice"

export default function WorkOrdersPage() {
  const dispatch = useDispatch()
  const { workOrders, loading, error } = useSelector((state) => state.workOrders)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  })
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Load work orders and stats on component mount
  useEffect(() => {
    loadWorkOrders()
    loadStats()
  }, [])

  // Update stats when work orders change
  useEffect(() => {
    if (workOrders && Array.isArray(workOrders)) {
      calculateStats()
    }
  }, [workOrders])

  // Load work orders from API
  const loadWorkOrders = async () => {
    try {
      setIsRefreshing(true)

      // Try to fetch from API first
      const filters = {
        status: statusFilter !== "all" ? statusFilter : undefined,
        priority: priorityFilter !== "all" ? priorityFilter : undefined,
        search: searchTerm || undefined,
      }

      // Comment out API call for now - uncomment when backend is ready
      // const apiData = await getWorkOrders(filters)
      // console.log('✅ Work orders loaded from API:', apiData)

      // For now, use Redux store data
      dispatch(fetchWorkOrders())
    } catch (error) {
      console.error("❌ Error loading work orders:", error)
      toast.error("Failed to load work orders. Using cached data.")
      // Fallback to Redux store
      dispatch(fetchWorkOrders())
    } finally {
      setIsRefreshing(false)
    }
  }

  // Calculate statistics from current work orders
  const calculateStats = () => {
    if (!workOrders || !Array.isArray(workOrders)) {
      return
    }

    const totalWorkOrders = workOrders.length
    const openCount = workOrders.filter((wo) => wo?.status === "Open").length
    const inProgressCount = workOrders.filter((wo) => wo?.status === "In Progress").length
    const completedCount = workOrders.filter((wo) => wo?.status === "Completed").length
    const overdueCount = workOrders.filter((wo) => wo?.priority === "High" && wo?.status !== "Completed").length

    setStats({
      total: totalWorkOrders,
      open: openCount,
      inProgress: inProgressCount,
      completed: completedCount,
      overdue: overdueCount,
    })
  }

  // Load statistics from API
  const loadStats = async () => {
    try {
      setIsLoadingStats(true)

      // Comment out API call for now - uncomment when backend is ready
      // const apiStats = await getWorkOrderStats()
      // setStats(apiStats)

      // For now, calculate stats from Redux store
      calculateStats()
    } catch (error) {
      console.error("❌ Error loading work order stats:", error)
      toast.error("Failed to load statistics")
      // Fallback to calculating from current data
      calculateStats()
    } finally {
      setIsLoadingStats(false)
    }
  }

  // Handle work order deletion
  const handleDeleteWorkOrder = async (workOrderId) => {
    try {
      // Comment out API call for now - uncomment when backend is ready
      // await deleteWorkOrderAPI(workOrderId)
      // console.log('✅ Work order deleted via API:', workOrderId)

      // For now, use Redux action
      dispatch(deleteWorkOrder(workOrderId))
      toast.success("Work order deleted successfully")

      // Reload data
      loadWorkOrders()
      loadStats()
    } catch (error) {
      console.error("❌ Error deleting work order:", error)
      toast.error("Failed to delete work order")
    }
  }

  // Safe filtering with null checks
  const filteredWorkOrders = (workOrders || []).filter((workOrder) => {
    if (!workOrder) return false

    // Safe string operations with fallbacks
    const title = workOrder.title || ""
    const description = workOrder.description || ""
    const equipmentId = workOrder.equipmentId || ""
    const status = workOrder.status || ""
    const priority = workOrder.priority || ""

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipmentId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || status === statusFilter
    const matchesPriority = priorityFilter === "all" || priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Open":
        return "destructive"
      case "In Progress":
        return "default"
      case "Completed":
        return "secondary"
      case "Cancelled":
        return "outline"
      default:
        return "default"
    }
  }

  // Get priority badge variant
  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "default"
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Open":
        return <AlertTriangle className="h-4 w-4" />
      case "In Progress":
        return <Clock className="h-4 w-4" />
      case "Completed":
        return <CheckCircle className="h-4 w-4" />
      case "Cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "No due date"
    try {
      return new Date(dateString).toLocaleDateString()
    } catch (error) {
      return "Invalid date"
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Work Orders</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={loadWorkOrders} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Work Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Work Order</DialogTitle>
              </DialogHeader>
              <WorkOrderForm
                onClose={() => setIsFormOpen(false)}
                onSuccess={() => {
                  loadWorkOrders()
                  loadStats()
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Work Orders</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingStats ? "..." : stats.total}</div>
            <p className="text-xs text-muted-foreground">All work orders in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{isLoadingStats ? "..." : stats.open}</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{isLoadingStats ? "..." : stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Currently being worked on</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{isLoadingStats ? "..." : stats.completed}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <XCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{isLoadingStats ? "..." : stats.overdue}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Work Orders Management</CardTitle>
          <CardDescription>Manage and track all maintenance work orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Work Orders Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Work Order</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Loading work orders...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredWorkOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                          ? "No work orders match your filters"
                          : "No work orders found"}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWorkOrders.map((workOrder) => (
                    <TableRow key={workOrder?.id || Math.random()}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{workOrder?.title || "Untitled"}</div>
                          <div className="text-sm text-muted-foreground">#{workOrder?.id || "N/A"}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{workOrder?.equipmentId || "N/A"}</div>
                        <div className="text-sm text-muted-foreground">{workOrder?.stationName || "N/A"}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(workOrder?.status)}
                          className="flex items-center gap-1 w-fit"
                        >
                          {getStatusIcon(workOrder?.status)}
                          {workOrder?.status || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadgeVariant(workOrder?.priority)}>
                          {workOrder?.priority || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {workOrder?.assignedTo || "Unassigned"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(workOrder?.dueDate)}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Work Order</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this work order? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteWorkOrder(workOrder?.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
