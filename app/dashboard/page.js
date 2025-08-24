"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ClipboardList,
  AlertTriangle,
  Clock,
  Plus,
  MapPin,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import WorkOrderForm from "@/components/work-order-form"
import { loadDashboardSummary, selectDashboardStats, selectDashboardRecentWorkOrders, selectDashboardLoading, selectDashboardError, selectDashboardAssetsSummary } from "@/lib/features/dashboard/dashboardSlice"

export default function DashboardPage() {
  const [showWorkOrderForm, setShowWorkOrderForm] = useState(false)
  const dispatch = useDispatch()

  const stats = useSelector(selectDashboardStats)
  const recentWorkOrders = useSelector(selectDashboardRecentWorkOrders)
  const loading = useSelector(selectDashboardLoading)
  const error = useSelector(selectDashboardError)
  const assetsSummary = useSelector(selectDashboardAssetsSummary)

  // KPI data derived from API stats (no change/trend)
  const kpiData = [
    { title: "Total Work Orders", value: String(stats.total || 0), icon: ClipboardList, color: "bg-blue-500" },
    { title: "In Progress", value: String(stats.inProgress || 0), icon: RefreshCw, color: "bg-blue-400" },
    { title: "Pending", value: String(stats.pending || 0), icon: Clock, color: "bg-yellow-500" },
    { title: "Overdue", value: String(stats.overdue || 0), icon: AlertTriangle, color: "bg-red-500" },
  ]

  const computePercentage = (active, total) => {
    if (!total) return 0
    return Math.round((active / total) * 100)
  }

  const assetStatus = (assetsSummary?.perCategory || []).map((c) => ({
    name: c.category,
    active: c.active,
    total: c.total,
    percentage: computePercentage(c.active, c.total),
  }))

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

  const loadDashboardData = async () => {
    try {
      await dispatch(loadDashboardSummary()).unwrap()
      toast("Dashboard Updated", { description: "Latest data has been loaded successfully." })
    } catch (err) {
      console.error("Dashboard data fetch error:", err)
      toast("Error Loading Data", { description: "Failed to load dashboard data. Using cached data." })
    }
  }

  useEffect(() => {
    loadDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="space-y-6 z-0">
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 z-0">
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
                <div key={order.id || order._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{order.id}</span>
                      <Badge variant="outline" className={getPriorityColor(order.priority)}>
                        {order.priority}
                      </Badge>
                    </div>
                    <h4 className="font-medium">{order.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {order.Equipment_ID} • {order.Requested_By}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{order.Station_Name}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-1 ml-4">
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    <p className="text-xs text-muted-foreground">Due: {new Date(order.dueDate).toLocaleDateString()}</p>
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
