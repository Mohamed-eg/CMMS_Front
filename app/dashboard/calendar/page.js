"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Download,
  Clock,
  MapPin,
  User,
  Wrench,
  AlertTriangle,
} from "lucide-react"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [stationFilter, setStationFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [viewMode, setViewMode] = useState("month")

  // Sample maintenance requests data
  const maintenanceRequests = [
    {
      id: "MR-001",
      title: "Fuel Dispenser Calibration",
      station: "Al-Noor Gas Station",
      equipment: "Dispenser A1",
      equipmentType: "Fuel Dispenser",
      status: "pending",
      priority: "high",
      date: "2024-01-15",
      time: "09:00",
      technician: "Ahmed Al-Rashid",
      estimatedDuration: "2 hours",
      description: "Routine calibration and flow rate verification",
      location: "Riyadh, Saudi Arabia",
      workOrderId: "WO-001",
    },
    {
      id: "MR-002",
      title: "Storage Tank Inspection",
      station: "Al-Barakah Station",
      equipment: "Tank #2",
      equipmentType: "Storage Tank",
      status: "in-progress",
      priority: "medium",
      date: "2024-01-15",
      time: "14:00",
      technician: "Mohammed Al-Fahad",
      estimatedDuration: "4 hours",
      description: "Leak detection and pressure testing",
      location: "Jeddah, Saudi Arabia",
      workOrderId: "WO-002",
    },
    {
      id: "MR-003",
      title: "Nozzle Replacement",
      station: "Al-Noor Gas Station",
      equipment: "Nozzle #5",
      equipmentType: "Nozzle",
      status: "completed",
      priority: "low",
      date: "2024-01-14",
      time: "11:00",
      technician: "Khalid Al-Mutairi",
      estimatedDuration: "1 hour",
      description: "Replace worn nozzle and test flow rate",
      location: "Riyadh, Saudi Arabia",
      workOrderId: "WO-003",
    },
    {
      id: "MR-004",
      title: "Emergency Pump Repair",
      station: "Al-Salam Station",
      equipment: "Pump #3",
      equipmentType: "Fuel Dispenser",
      status: "overdue",
      priority: "high",
      date: "2024-01-12",
      time: "08:00",
      technician: "Omar Al-Zahra",
      estimatedDuration: "3 hours",
      description: "Pump motor malfunction - urgent repair needed",
      location: "Dammam, Saudi Arabia",
      workOrderId: "WO-004",
    },
    {
      id: "MR-005",
      title: "Hose Inspection",
      station: "Al-Barakah Station",
      equipment: "Hose Set B",
      equipmentType: "Hose",
      status: "pending",
      priority: "medium",
      date: "2024-01-16",
      time: "10:30",
      technician: "Fahad Al-Mutairi",
      estimatedDuration: "1.5 hours",
      description: "Routine hose inspection and pressure test",
      location: "Jeddah, Saudi Arabia",
      workOrderId: "WO-005",
    },
    {
      id: "MR-006",
      title: "Safety Equipment Check",
      station: "Al-Salam Station",
      equipment: "Fire Extinguishers",
      equipmentType: "Safety Equipment",
      status: "cancelled",
      priority: "low",
      date: "2024-01-13",
      time: "15:00",
      technician: "Abdullah Al-Rashid",
      estimatedDuration: "2 hours",
      description: "Monthly safety equipment inspection",
      location: "Dammam, Saudi Arabia",
      workOrderId: "WO-006",
    },
  ]

  // Filter requests based on selected filters
  const filteredRequests = useMemo(() => {
    return maintenanceRequests.filter((request) => {
      if (statusFilter !== "all" && request.status !== statusFilter) return false
      if (stationFilter !== "all" && request.station !== stationFilter) return false
      if (priorityFilter !== "all" && request.priority !== priorityFilter) return false
      return true
    })
  }, [maintenanceRequests, statusFilter, stationFilter, priorityFilter])

  // Get unique stations for filter
  const stations = [...new Set(maintenanceRequests.map((req) => req.station))]

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200"
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  // Calendar navigation
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Get calendar days
  const getCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const currentDateObj = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      const dayRequests = filteredRequests.filter((req) => {
        const reqDate = new Date(req.date)
        return (
          reqDate.getDate() === currentDateObj.getDate() &&
          reqDate.getMonth() === currentDateObj.getMonth() &&
          reqDate.getFullYear() === currentDateObj.getFullYear()
        )
      })

      days.push({
        date: new Date(currentDateObj),
        isCurrentMonth: currentDateObj.getMonth() === month,
        isToday: currentDateObj.toDateString() === new Date().toDateString(),
        requests: dayRequests,
      })

      currentDateObj.setDate(currentDateObj.getDate() + 1)
    }

    return days
  }

  const calendarDays = getCalendarDays()
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Statistics
  const stats = {
    total: filteredRequests.length,
    completed: filteredRequests.filter((r) => r.status === "completed").length,
    pending: filteredRequests.filter((r) => r.status === "pending").length,
    overdue: filteredRequests.filter((r) => r.status === "overdue").length,
    inProgress: filteredRequests.filter((r) => r.status === "in-progress").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Calendar</h1>
          <p className="text-muted-foreground">Schedule and track maintenance requests across all gas stations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All maintenance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Finished tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Active work</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={stationFilter} onValueChange={setStationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Stations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stations</SelectItem>
                {stations.map((station) => (
                  <SelectItem key={station} value={station}>
                    {station}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>

            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger>
                <SelectValue placeholder="View Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month View</SelectItem>
                <SelectItem value="week">Week View</SelectItem>
                <SelectItem value="list">List View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      {viewMode === "month" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border rounded-lg ${
                    day.isCurrentMonth ? "bg-white" : "bg-gray-50"
                  } ${day.isToday ? "ring-2 ring-blue-500" : ""}`}
                >
                  <div className={`text-sm font-medium mb-2 ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}`}>
                    {day.date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {day.requests.slice(0, 3).map((request) => (
                      <div
                        key={request.id}
                        className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${getStatusColor(request.status)}`}
                        onClick={() => setSelectedRequest(request)}
                      >
                        <div className="font-medium truncate">{request.title}</div>
                        <div className="flex items-center gap-1 text-xs opacity-75">
                          <Clock className="h-3 w-3" />
                          {request.time}
                        </div>
                      </div>
                    ))}
                    {day.requests.length > 3 && (
                      <div className="text-xs text-muted-foreground">+{day.requests.length - 3} more</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Requests List</CardTitle>
            <CardDescription>Showing {filteredRequests.length} maintenance requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(request.status).replace("bg-", "bg-").replace("text-", "").replace("border-", "").split(" ")[0]}`}
                    />
                    <div>
                      <h3 className="font-medium">{request.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {request.station}
                        </span>
                        <span className="flex items-center gap-1">
                          <Wrench className="h-3 w-3" />
                          {request.equipment}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {request.technician}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(request.status)}>{request.status.replace("-", " ")}</Badge>
                      <span className={`text-sm font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {request.date} at {request.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Request Details Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              {selectedRequest?.title}
            </DialogTitle>
            <DialogDescription>Work Order: {selectedRequest?.workOrderId}</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Badge className={getStatusColor(selectedRequest.status)}>
                  {selectedRequest.status.replace("-", " ")}
                </Badge>
                <span className={`font-medium ${getPriorityColor(selectedRequest.priority)}`}>
                  {selectedRequest.priority.toUpperCase()} PRIORITY
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Schedule</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {selectedRequest.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {selectedRequest.time} ({selectedRequest.estimatedDuration})
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Location</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {selectedRequest.station}
                    </div>
                    <div>{selectedRequest.location}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Equipment</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      {selectedRequest.equipment}
                    </div>
                    <div>{selectedRequest.equipmentType}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Technician</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {selectedRequest.technician}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedRequest.description}</p>
              </div>

              {selectedRequest.status === "overdue" && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-800">
                    This maintenance request is overdue and requires immediate attention.
                  </span>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
