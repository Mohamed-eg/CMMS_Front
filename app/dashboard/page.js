"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardList, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown, Plus } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  const kpiData = [
    {
      title: "Total Work Orders",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: ClipboardList,
      color: "bg-blue-500",
    },
    {
      title: "Completed Tasks",
      value: "89",
      change: "+8%",
      trend: "up",
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "In Progress",
      value: "34",
      change: "-3%",
      trend: "down",
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "Overdue",
      value: "12",
      change: "+2",
      trend: "up",
      icon: AlertTriangle,
      color: "bg-red-500",
    },
  ]

  const recentWorkOrders = [
    {
      id: "WO-001",
      title: "Fuel Pump #3 Maintenance",
      asset: "Pump Station A",
      technician: "Mohammed Al-Fahad",
      priority: "High",
      status: "In Progress",
      dueDate: "2024-01-15",
    },
    {
      id: "WO-002",
      title: "Tank Level Sensor Check",
      asset: "Storage Tank #2",
      technician: "Abdullah Al-Rashid",
      priority: "Medium",
      status: "Pending",
      dueDate: "2024-01-16",
    },
    {
      id: "WO-003",
      title: "Compressor Oil Change",
      asset: "Air Compressor",
      technician: "Khalid Al-Mutairi",
      priority: "Low",
      status: "Completed",
      dueDate: "2024-01-14",
    },
  ]

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening at your gas station.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Work Order
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <div className={`p-2 rounded-full ${kpi.color}`}>
                <kpi.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {kpi.trend === "up" ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                {kpi.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Work Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Work Orders</CardTitle>
            <CardDescription>Latest maintenance tasks and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWorkOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{order.id}</span>
                      <Badge variant="outline" className={getPriorityColor(order.priority)}>
                        {order.priority}
                      </Badge>
                    </div>
                    <h4 className="font-medium">{order.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {order.asset} • {order.technician}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    <p className="text-xs text-muted-foreground">Due: {order.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Asset Status */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Status</CardTitle>
            <CardDescription>Current status of critical assets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fuel Pumps</span>
                <span>8/10 Active</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage Tanks</span>
                <span>4/4 Active</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Compressors</span>
                <span>2/3 Active</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Safety Systems</span>
                <span>5/5 Active</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Maintenance</CardTitle>
            <CardDescription>Scheduled maintenance tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Tank Inspection</p>
                  <p className="text-xs text-muted-foreground">Tomorrow</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Pump Calibration</p>
                  <p className="text-xs text-muted-foreground">Jan 18</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Fire System Check</p>
                  <p className="text-xs text-muted-foreground">Jan 20</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>This month's performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm">Completion Rate</span>
              <span className="text-sm font-medium">87%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Avg Response Time</span>
              <span className="text-sm font-medium">2.3 hrs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Active Technicians</span>
              <span className="text-sm font-medium">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Cost Savings</span>
              <span className="text-sm font-medium text-green-600">+15%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
