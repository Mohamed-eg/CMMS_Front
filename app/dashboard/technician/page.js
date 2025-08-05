"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Wrench, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Bell,
  MapPin,
  User
} from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import WorkOrderForm from "@/components/work-order-form"

export default function TechnicianPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [showWorkOrderForm, setShowWorkOrderForm] = useState(false)
  const [assignedWorkOrders, setAssignedWorkOrders] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  // Mock data for assigned work orders (replace with API call)
  useEffect(() => {
    setAssignedWorkOrders([
      {
        id: "WO-001",
        title: "Fuel Pump #3 Maintenance",
        asset: "Pump Station A",
        priority: "High",
        status: "In Progress",
        dueDate: "2024-01-15",
        location: "Al-Noor Gas Station - Riyadh",
        description: "Perform routine maintenance on fuel pump #3",
        assignedTo: "Technician",
        createdAt: "2024-01-10"
      },
      {
        id: "WO-002",
        title: "Tank Level Sensor Check",
        asset: "Storage Tank #2",
        priority: "Medium",
        status: "Pending",
        dueDate: "2024-01-16",
        location: "Al-Salam Gas Station - Jeddah",
        description: "Check and calibrate tank level sensors",
        assignedTo: "Technician",
        createdAt: "2024-01-11"
      },
      {
        id: "WO-003",
        title: "Compressor Oil Change",
        asset: "Air Compressor",
        priority: "Low",
        status: "Completed",
        dueDate: "2024-01-14",
        location: "Al-Waha Gas Station - Dammam",
        description: "Change oil and perform basic maintenance",
        assignedTo: "Technician",
        createdAt: "2024-01-09"
      }
    ])

    setNotifications([
      {
        id: 1,
        type: "work_order_assigned",
        message: "New work order WO-004 assigned to you",
        timestamp: "2024-01-12T10:30:00Z",
        read: false
      },
      {
        id: 2,
        type: "work_order_updated",
        message: "Work order WO-001 status updated to In Progress",
        timestamp: "2024-01-12T09:15:00Z",
        read: true
      },
      {
        id: 3,
        type: "maintenance_due",
        message: "Scheduled maintenance due for Pump #2 tomorrow",
        timestamp: "2024-01-12T08:45:00Z",
        read: false
      }
    ])
  }, [])

  const handleWorkOrderSubmit = (workOrderData) => {
    console.log("Work Order Submitted:", workOrderData)
    setShowWorkOrderForm(false)
    toast.success("Work order submitted successfully!")
    
    // Add to assigned work orders
    const newWorkOrder = {
      id: `WO-${Date.now()}`,
      title: workOrderData.title,
      asset: workOrderData.equipment,
      priority: workOrderData.priority,
      status: "Pending",
      dueDate: workOrderData.dueDate,
      location: workOrderData.location || "Current Location",
      description: workOrderData.issueDescription,
      assignedTo: "Technician",
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    setAssignedWorkOrders(prev => [newWorkOrder, ...prev])
  }

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4" />
      case "In Progress":
        return <Clock className="h-4 w-4" />
      case "Pending":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const unreadNotifications = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Technician Portal</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName || user?.FirstName || "Technician"}! Manage your work orders and submit new requests.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="relative" onClick={() => router.push("/dashboard/technician/notifications")}>
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            {unreadNotifications > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {unreadNotifications}
              </Badge>
            )}
          </Button>
          <Button onClick={() => router.push("/dashboard/technician/submit")}>
            <Plus className="mr-2 h-4 w-4" />
            Submit Work Order
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedWorkOrders.length}</div>
            <p className="text-xs text-muted-foreground">Work orders assigned to you</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignedWorkOrders.filter(wo => wo.status === "In Progress").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently working on</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignedWorkOrders.filter(wo => wo.status === "Completed").length}
            </div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignedWorkOrders.filter(wo => wo.status === "Pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="assigned" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assigned">My Work Orders</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Work Orders</CardTitle>
              <CardDescription>Work orders assigned to you for completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignedWorkOrders.map((workOrder) => (
                  <div key={workOrder.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{workOrder.id}</span>
                        <Badge variant="outline" className={getPriorityColor(workOrder.priority)}>
                          {workOrder.priority}
                        </Badge>
                        <Badge className={getStatusColor(workOrder.status)}>
                          {getStatusIcon(workOrder.status)}
                          <span className="ml-1">{workOrder.status}</span>
                        </Badge>
                      </div>
                      <h4 className="font-medium">{workOrder.title}</h4>
                      <p className="text-sm text-muted-foreground">{workOrder.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Wrench className="h-3 w-3" />
                          <span>{workOrder.asset}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{workOrder.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Due: {workOrder.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {workOrder.status === "Pending" && (
                        <Button size="sm">
                          Start Work
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Recent updates and important messages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`flex items-center gap-3 p-3 border rounded-lg ${
                      !notification.read ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      !notification.read ? 'bg-blue-500' : 'bg-gray-300'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <Badge variant="secondary" className="text-xs">New</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Work Order Form Modal */}
      {showWorkOrderForm && (
        <WorkOrderForm
          isOpen={showWorkOrderForm}
          onClose={() => setShowWorkOrderForm(false)}
          onSubmit={handleWorkOrderSubmit}
        />
      )}
    </div>
  )
} 