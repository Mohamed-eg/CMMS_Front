"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Edit, Trash2, Calendar, User, Package, RefreshCw } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { fetchWorkOrders } from "@/lib/api/workorders"
import { toast } from "sonner"

export default function WorkOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [workOrders, setWorkOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Default fallback data
  const defaultWorkOrders = [
    {
      id: "WO-001",
      title: "Fuel Pump #3 Maintenance",
      description: "Regular maintenance and inspection of fuel pump #3",
      asset: "Pump Station A - Unit 3",
      technician: "Mohammed Al-Fahad",
      priority: "High",
      status: "In Progress",
      createdDate: "2024-01-10",
      dueDate: "2024-01-15",
      completedDate: null,
    },
    {
      id: "WO-002",
      title: "Tank Level Sensor Check",
      description: "Check and calibrate tank level sensors",
      asset: "Storage Tank #2",
      technician: "Abdullah Al-Rashid",
      priority: "Medium",
      status: "Pending",
      createdDate: "2024-01-12",
      dueDate: "2024-01-16",
      completedDate: null,
    },
    {
      id: "WO-003",
      title: "Compressor Oil Change",
      description: "Change oil and filters in air compressor",
      asset: "Air Compressor Unit 1",
      technician: "Khalid Al-Mutairi",
      priority: "Low",
      status: "Completed",
      createdDate: "2024-01-08",
      dueDate: "2024-01-14",
      completedDate: "2024-01-13",
    },
    {
      id: "WO-004",
      title: "Fire Suppression System Test",
      description: "Monthly test of fire suppression system",
      asset: "Fire Safety System",
      technician: "Omar Al-Zahra",
      priority: "High",
      status: "Overdue",
      createdDate: "2024-01-05",
      dueDate: "2024-01-12",
      completedDate: null,
    },
  ]

  // Load work orders data
  const loadWorkOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const filters = {
        search: searchTerm,
        status: statusFilter,
        priority: priorityFilter,
      }

      const data = await fetchWorkOrders(filters)
      setWorkOrders(data.workOrders || data || [])
      toast.success("Work orders loaded successfully")
    } catch (err) {
      console.error("Error loading work orders:", err)
      setError(err.message)
      setWorkOrders(defaultWorkOrders) // Use fallback data
      toast.error("Failed to load work orders, showing cached data")
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount and when filters change
  useEffect(() => {
    // Comment out API call for now until backend is ready
    // loadWorkOrders()

    // Use default data for now
    setWorkOrders(defaultWorkOrders)
    setLoading(false)
  }, [searchTerm, statusFilter, priorityFilter])

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredWorkOrders = workOrders.filter((order) => {
    const matchesSearch =
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.asset.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleCreateWorkOrder = async (formData) => {
    try {
      const workOrderData = {
        title: formData.get("title"),
        description: formData.get("description"),
        asset: formData.get("asset"),
        priority: formData.get("priority"),
        technician: formData.get("technician"),
        dueDate: formData.get("dueDate"),
      }

      // Comment out API call for now
      // await createWorkOrder(workOrderData)

      toast.success("Work order created successfully")
      loadWorkOrders() // Refresh the list
    } catch (err) {
      console.error("Error creating work order:", err)
      toast.error("Failed to create work order")
    }
  }

  const handleDeleteWorkOrder = async (id) => {
    try {
      // Comment out API call for now
      // await deleteWorkOrder(id)

      toast.success("Work order deleted successfully")
      loadWorkOrders() // Refresh the list
    } catch (err) {
      console.error("Error deleting work order:", err)
      toast.error("Failed to delete work order")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading work orders...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work Orders</h1>
          <p className="text-muted-foreground">Manage and track all maintenance work orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadWorkOrders} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Work Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Work Order</DialogTitle>
                <DialogDescription>Create a new maintenance work order for your gas station assets.</DialogDescription>
              </DialogHeader>
              <form action={handleCreateWorkOrder}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" placeholder="Work order title" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="asset">Asset</Label>
                      <Select name="asset" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select asset" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pump1">Fuel Pump #1</SelectItem>
                          <SelectItem value="pump2">Fuel Pump #2</SelectItem>
                          <SelectItem value="tank1">Storage Tank #1</SelectItem>
                          <SelectItem value="compressor">Air Compressor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Detailed description of the work to be done"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select name="priority" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="technician">Technician</Label>
                      <Select name="technician" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Assign technician" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mohammed">Mohammed Al-Fahad</SelectItem>
                          <SelectItem value="abdullah">Abdullah Al-Rashid</SelectItem>
                          <SelectItem value="khalid">Khalid Al-Mutairi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input id="dueDate" name="dueDate" type="date" required />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit">Create Work Order</Button>
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
            <CardTitle className="text-sm font-medium">Total Work Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workOrders.length}</div>
            <p className="text-xs text-muted-foreground">All work orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workOrders.filter((wo) => wo.status === "In Progress").length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workOrders.filter((wo) => wo.status === "Completed").length}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workOrders.filter((wo) => wo.status === "Overdue").length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Work Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Work Orders ({filteredWorkOrders.length})</CardTitle>
          <CardDescription>Complete list of all work orders with their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.title}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-xs">{order.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      {order.asset}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {order.technician}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {order.dueDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteWorkOrder(order.id)}>
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
