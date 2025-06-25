"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Plus,
  MapPin,
  Loader2,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import WorkOrderForm from "@/components/work-order-form"

export default function DashboardPage() {
  const [showWorkOrderForm, setShowWorkOrderForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Mock data for now (will be replaced with API data)
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
      location: "Al-Noor Gas Station - Riyadh",
      coordinates: "24.7136° N, 46.6753° E",
      submittedFrom: "On-site",
    },
    {
      id: "WO-002",
      title: "Tank Level Sensor Check",
      asset: "Storage Tank #2",
      technician: "Abdullah Al-Rashid",
      priority: "Medium",
      status: "Pending",
      dueDate: "2024-01-16",
      location: "Al-Salam Gas Station - Jeddah",
      coordinates: "21.3891° N, 39.8579° E",
      submittedFrom: "Remote",
    },
    {
      id: "WO-003",
      title: "Compressor Oil Change",
      asset: "Air Compressor",
      technician: "Khalid Al-Mutairi",
      priority: "Low",
      status: "Completed",
      dueDate: "2024-01-14",
      location: "Al-Waha Gas Station - Dammam",
      coordinates: "26.4207° N, 50.0888° E",
      submittedFrom: "Mobile App",
    },
  ]

  const assetStatus = [
    { name: "Fuel Pumps", active: 8, total: 10, percentage: 80 },
    { name: "Storage Tanks", active: 4, total: 4, percentage: 100 },
    { name: "Compressors", active: 2, total: 3, percentage: 67 },
    { name: "Safety Systems", active: 5, total: 5, percentage: 100 },
  ]

  const upcomingMaintenance = [
    { title: "Tank Inspection", dueDate: "Tomorrow", priority: "high" },
    { title: "Pump Calibration", dueDate: "Jan 18", priority: "medium" },
    { title: "Fire System Check", dueDate: "Jan 20", priority: "low" },
  ]

  const quickStats = {
    completionRate: 87,
    avgResponseTime: "2.3 hrs",
    activeTechnicians: 12,
    costSavings: "+15%",
  }

  // API functions (will connect to backend later)
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast("Dashboard Updated", {
        description: "Latest data has been loaded successfully.",
      })
    } catch (err) {
      setError(err.message)
      console.error("Dashboard data fetch error:", err)

      toast("Error Loading Data", {
        description: "Failed to load dashboard data. Using cached data.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // loadDashboardData() // Uncomment when API is ready
  }, [])

  const refreshData = async () => {
    await loadDashboardData()
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

  const handleWorkOrderSubmit = (workOrderData) => {
    console.log("Work Order Submitted:", workOrderData)
    setShowWorkOrderForm(false)
    toast("Work Order Created", {
      description: "New work order has been submitted successfully.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening at your gas station.</p>
          {error && <p className="text-sm text-red-600 mt-1">⚠️ Some data may be outdated due to connection issues</p>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Refresh
          </Button>
          <Button onClick={() => setShowWorkOrderForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Work Order
          </Button>
        </div>
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
                  <div className="space-y-2 flex-1">
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
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{order.location}</span>
                      <span className="text-gray-400">•</span>
                      <span>{order.coordinates}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="secondary" className="text-xs">
                        {order.submittedFrom}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right space-y-1 ml-4">
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    <p className="text-xs text-muted-foreground">Due: {order.dueDate}</p>
                    <Button variant="ghost" size="sm" className="text-xs h-6">
                      <MapPin className="h-3 w-3 mr-1" />
                      View Map
                    </Button>
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
            {assetStatus.map((asset, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{asset.name}</span>
                  <span>
                    {asset.active}/{asset.total} Active
                  </span>
                </div>
                <Progress value={asset.percentage} className="h-2" />
              </div>
            ))}
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
              {upcomingMaintenance.map((maintenance, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      maintenance.priority === "high"
                        ? "bg-red-500"
                        : maintenance.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{maintenance.title}</p>
                    <p className="text-xs text-muted-foreground">{maintenance.dueDate}</p>
                  </div>
                </div>
              ))}
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
              <span className="text-sm font-medium">{quickStats.completionRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Avg Response Time</span>
              <span className="text-sm font-medium">{quickStats.avgResponseTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Active Technicians</span>
              <span className="text-sm font-medium">{quickStats.activeTechnicians}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Cost Savings</span>
              <span className="text-sm font-medium text-green-600">{quickStats.costSavings}</span>
            </div>
          </CardContent>
        </Card>
      </div>

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
