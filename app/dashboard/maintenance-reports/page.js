"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Download,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FileText,
  BarChart3,
  Search,
  Filter,
  X,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function MaintenanceReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30")
  const [selectedAssetType, setSelectedAssetType] = useState("all")

  // New filter states
  const [dateFilter, setDateFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [equipmentIdFilter, setEquipmentIdFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Enhanced Maintenance History Data
  const maintenanceHistory = [
    {
      assetId: "DISP-001",
      assetName: "Fuel Pump #1",
      assetType: "Fuel Dispenser",
      workOrderId: "WO-001",
      maintenanceType: "Routine Inspection",
      technician: "Mohammed Al-Fahad",
      date: "2024-01-15",
      duration: "2.5 hours",
      cost: "SAR 450",
      status: "Completed",
      nextDue: "2024-02-15",
      issues: ["Minor calibration adjustment", "Replaced worn gasket"],
    },
    {
      assetId: "TANK-001",
      assetName: "Storage Tank #1",
      assetType: "Storage Tank",
      workOrderId: "WO-002",
      maintenanceType: "Leak Detection Test",
      technician: "Abdullah Al-Rashid",
      date: "2024-01-12",
      duration: "4 hours",
      cost: "SAR 800",
      status: "Completed",
      nextDue: "2024-04-12",
      issues: ["All tests passed", "No leaks detected"],
    },
    {
      assetId: "NOZZLE-003",
      assetName: "Nozzle #3 - Island A",
      assetType: "Nozzle",
      workOrderId: "WO-003",
      maintenanceType: "Replacement",
      technician: "Khalid Al-Mutairi",
      date: "2024-01-10",
      duration: "1 hour",
      cost: "SAR 280",
      status: "Completed",
      nextDue: "2025-01-10",
      issues: ["End of life replacement", "Flow rate below threshold"],
    },
    {
      assetId: "DISP-002",
      assetName: "Fuel Pump #2",
      assetType: "Fuel Dispenser",
      workOrderId: "WO-004",
      maintenanceType: "Emergency Repair",
      technician: "Omar Al-Zahra",
      date: "2024-01-08",
      duration: "3.5 hours",
      cost: "SAR 650",
      status: "In Progress",
      nextDue: "2024-02-08",
      issues: ["Display malfunction", "Pump motor noise"],
    },
    {
      assetId: "HOSE-005",
      assetName: "Hose #5 - Island B",
      assetType: "Hose",
      workOrderId: "WO-005",
      maintenanceType: "Preventive Maintenance",
      technician: "Fahad Al-Mutairi",
      date: "2024-01-05",
      duration: "1.5 hours",
      cost: "SAR 320",
      status: "Overdue",
      nextDue: "2024-01-20",
      issues: ["Pressure test required", "Visual inspection needed"],
    },
    {
      assetId: "TANK-002",
      assetName: "Storage Tank #2",
      assetType: "Storage Tank",
      workOrderId: "WO-006",
      maintenanceType: "Corrosion Inspection",
      technician: "Ahmed Al-Rashid",
      date: "2024-01-03",
      duration: "5 hours",
      cost: "SAR 950",
      status: "Pending",
      nextDue: "2024-07-03",
      issues: ["Scheduled inspection", "Coating assessment"],
    },
    {
      assetId: "NOZZLE-007",
      assetName: "Nozzle #7 - Island C",
      assetType: "Nozzle",
      workOrderId: "WO-007",
      maintenanceType: "Flow Rate Calibration",
      technician: "Mohammed Al-Fahad",
      date: "2024-01-01",
      duration: "2 hours",
      cost: "SAR 380",
      status: "Completed",
      nextDue: "2024-04-01",
      issues: ["Calibration completed", "Flow rate within specs"],
    },
  ]

  // Filtered maintenance history
  const filteredMaintenanceHistory = useMemo(() => {
    return maintenanceHistory.filter((item) => {
      // Asset type filter
      if (selectedAssetType !== "all" && item.assetType !== selectedAssetType) {
        return false
      }

      // Date filter
      if (dateFilter && !item.date.includes(dateFilter)) {
        return false
      }

      // Status filter
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false
      }

      // Equipment ID filter
      if (equipmentIdFilter && !item.assetId.toLowerCase().includes(equipmentIdFilter.toLowerCase())) {
        return false
      }

      // Search term filter (searches in asset name, technician, and work order ID)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return (
          item.assetName.toLowerCase().includes(searchLower) ||
          item.technician.toLowerCase().includes(searchLower) ||
          item.workOrderId.toLowerCase().includes(searchLower) ||
          item.maintenanceType.toLowerCase().includes(searchLower)
        )
      }

      return true
    })
  }, [maintenanceHistory, selectedAssetType, dateFilter, statusFilter, equipmentIdFilter, searchTerm])

  // Component Lifetime Data
  const componentLifetime = [
    {
      component: "Fuel Dispensers",
      totalUnits: 8,
      averageAge: "1.2 years",
      expectedLifespan: "10 years",
      remainingLife: "88%",
      nextReplacement: "2032-2033",
      maintenanceFrequency: "Monthly",
      totalUsageHours: 8760,
      flowRateAnomalies: 12,
      recentIssues: 3,
    },
    {
      component: "Storage Tanks",
      totalUnits: 3,
      averageAge: "1.5 years",
      expectedLifespan: "25 years",
      remainingLife: "94%",
      nextReplacement: "2047-2048",
      maintenanceFrequency: "Quarterly",
      pressureTests: 4,
      leakDetectionTests: 12,
      corrosionInspections: 2,
    },
    {
      component: "Nozzles",
      totalUnits: 16,
      averageAge: "8 months",
      expectedLifespan: "1.5 years",
      remainingLife: "47%",
      nextReplacement: "2024-2025",
      maintenanceFrequency: "Bi-weekly",
      replacements: 4,
      flowRateTests: 32,
      wearInspections: 16,
    },
    {
      component: "Hoses",
      totalUnits: 16,
      averageAge: "10 months",
      expectedLifespan: "2.5 years",
      remainingLife: "67%",
      nextReplacement: "2025-2026",
      maintenanceFrequency: "Monthly",
      replacements: 2,
      pressureTests: 16,
      visualInspections: 48,
    },
  ]

  // Technician Performance Data
  const technicianPerformance = [
    {
      name: "Mohammed Al-Fahad",
      completedTasks: 45,
      averageTime: "2.3 hours",
      efficiency: "94%",
      qualityScore: "4.8/5",
      specialization: "Fuel Systems",
      totalHours: 103.5,
      overdueCount: 1,
    },
    {
      name: "Abdullah Al-Rashid",
      completedTasks: 38,
      averageTime: "3.1 hours",
      efficiency: "87%",
      qualityScore: "4.6/5",
      specialization: "Storage & Safety",
      totalHours: 117.8,
      overdueCount: 2,
    },
    {
      name: "Khalid Al-Mutairi",
      completedTasks: 52,
      averageTime: "1.8 hours",
      efficiency: "96%",
      qualityScore: "4.9/5",
      specialization: "Nozzles & Hoses",
      totalHours: 93.6,
      overdueCount: 0,
    },
  ]

  // Predictive Analytics Data
  const predictiveAnalytics = [
    {
      asset: "Fuel Pump #3",
      riskLevel: "High",
      predictedFailure: "2024-03-15",
      confidence: "85%",
      recommendation: "Schedule preventive maintenance within 2 weeks",
      indicators: ["Increasing vibration", "Flow rate declining", "Higher maintenance frequency"],
    },
    {
      asset: "Nozzle #7",
      riskLevel: "Medium",
      predictedFailure: "2024-04-20",
      confidence: "72%",
      recommendation: "Monitor closely, plan replacement",
      indicators: ["Wear patterns detected", "Flow rate variations", "Customer complaints"],
    },
    {
      asset: "Hose #12",
      riskLevel: "Low",
      predictedFailure: "2024-08-10",
      confidence: "68%",
      recommendation: "Continue routine maintenance",
      indicators: ["Normal wear", "Within expected parameters"],
    },
  ]

  const getRiskColor = (risk) => {
    switch (risk) {
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

  const getLifetimeColor = (percentage) => {
    const percent = Number.parseInt(percentage)
    if (percent > 70) return "text-green-600"
    if (percent > 40) return "text-yellow-600"
    return "text-red-600"
  }

  const clearAllFilters = () => {
    setSelectedAssetType("all")
    setDateFilter("")
    setStatusFilter("all")
    setEquipmentIdFilter("")
    setSearchTerm("")
  }

  const hasActiveFilters =
    selectedAssetType !== "all" || dateFilter || statusFilter !== "all" || equipmentIdFilter || searchTerm

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance & Asset Lifetime Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive maintenance history, component tracking, and predictive analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="history">Maintenance History</TabsTrigger>
          <TabsTrigger value="lifetime">Component Lifetime</TabsTrigger>
          <TabsTrigger value="performance">Technician Performance</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Maintenance History */}
        <TabsContent value="history" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredMaintenanceHistory.length}</div>
                <p className="text-xs text-muted-foreground">Tasks {hasActiveFilters ? "filtered" : "total"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Average Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4h</div>
                <p className="text-xs text-muted-foreground">Per task</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">SAR 45K</div>
                <p className="text-xs text-muted-foreground">This period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">On-time completion</p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Maintenance History Filters
                </CardTitle>
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearAllFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Asset Type Filter */}
                <Select value={selectedAssetType} onValueChange={setSelectedAssetType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Asset Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Asset Types</SelectItem>
                    <SelectItem value="Fuel Dispenser">Fuel Dispensers</SelectItem>
                    <SelectItem value="Storage Tank">Storage Tanks</SelectItem>
                    <SelectItem value="Nozzle">Nozzles</SelectItem>
                    <SelectItem value="Hose">Hoses</SelectItem>
                  </SelectContent>
                </Select>

                {/* Date Filter */}
                <Input
                  type="date"
                  placeholder="Filter by date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>

                {/* Equipment ID Filter */}
                <Input
                  placeholder="Equipment ID"
                  value={equipmentIdFilter}
                  onChange={(e) => setEquipmentIdFilter(e.target.value)}
                />

                {/* Results Count */}
                <div className="flex items-center justify-center">
                  <Badge variant="outline" className="text-sm">
                    {filteredMaintenanceHistory.length} results
                  </Badge>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedAssetType !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Asset: {selectedAssetType}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedAssetType("all")} />
                    </Badge>
                  )}
                  {dateFilter && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Date: {dateFilter}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setDateFilter("")} />
                    </Badge>
                  )}
                  {statusFilter !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Status: {statusFilter}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setStatusFilter("all")} />
                    </Badge>
                  )}
                  {equipmentIdFilter && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      ID: {equipmentIdFilter}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setEquipmentIdFilter("")} />
                    </Badge>
                  )}
                  {searchTerm && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Search: {searchTerm}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
              <CardDescription>
                {hasActiveFilters
                  ? `Showing ${filteredMaintenanceHistory.length} filtered results`
                  : `Showing all ${maintenanceHistory.length} maintenance records`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredMaintenanceHistory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No maintenance records match your filters.</p>
                  <Button variant="outline" onClick={clearAllFilters} className="mt-2">
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Work Order</TableHead>
                      <TableHead>Maintenance Type</TableHead>
                      <TableHead>Technician</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Next Due</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaintenanceHistory.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.assetName}</p>
                            <p className="text-sm text-muted-foreground">{item.assetId}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{item.workOrderId}</TableCell>
                        <TableCell>{item.maintenanceType}</TableCell>
                        <TableCell>{item.technician}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.duration}</TableCell>
                        <TableCell>{item.cost}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                        </TableCell>
                        <TableCell>{item.nextDue}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Component Lifetime Tracking */}
        <TabsContent value="lifetime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Component Lifetime Overview</CardTitle>
              <CardDescription>Track usage, lifespan, and replacement schedules for all components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {componentLifetime.map((component, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{component.component}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Units: {component.totalUnits}</Badge>
                          <Badge className={getLifetimeColor(component.remainingLife)}>
                            {component.remainingLife} remaining
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium">Average Age</Label>
                          <p className="text-sm">{component.averageAge}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Expected Lifespan</Label>
                          <p className="text-sm">{component.expectedLifespan}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Next Replacement</Label>
                          <p className="text-sm">{component.nextReplacement}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Maintenance Frequency</Label>
                          <p className="text-sm">{component.maintenanceFrequency}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Remaining Lifetime</span>
                          <span>{component.remainingLife}</span>
                        </div>
                        <Progress value={Number.parseInt(component.remainingLife)} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        {component.totalUsageHours && (
                          <div>
                            <Label className="font-medium">Usage Hours</Label>
                            <p>{component.totalUsageHours.toLocaleString()}</p>
                          </div>
                        )}
                        {component.flowRateAnomalies && (
                          <div>
                            <Label className="font-medium">Flow Rate Anomalies</Label>
                            <p>{component.flowRateAnomalies}</p>
                          </div>
                        )}
                        {component.replacements && (
                          <div>
                            <Label className="font-medium">Replacements</Label>
                            <p>{component.replacements} this year</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technician Performance */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technician Performance Metrics</CardTitle>
              <CardDescription>Track individual and team productivity and task completion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {technicianPerformance.map((tech, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{tech.name}</CardTitle>
                      <CardDescription>{tech.specialization}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="font-medium">Completed Tasks</Label>
                          <p className="text-lg font-bold">{tech.completedTasks}</p>
                        </div>
                        <div>
                          <Label className="font-medium">Average Time</Label>
                          <p className="text-lg font-bold">{tech.averageTime}</p>
                        </div>
                        <div>
                          <Label className="font-medium">Efficiency</Label>
                          <p className="text-lg font-bold text-green-600">{tech.efficiency}</p>
                        </div>
                        <div>
                          <Label className="font-medium">Quality Score</Label>
                          <p className="text-lg font-bold text-blue-600">{tech.qualityScore}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Efficiency</span>
                          <span>{tech.efficiency}</span>
                        </div>
                        <Progress value={Number.parseInt(tech.efficiency)} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <Label className="font-medium">Total Hours</Label>
                          <p>{tech.totalHours}</p>
                        </div>
                        <div>
                          <Label className="font-medium">Overdue Count</Label>
                          <p className={tech.overdueCount > 0 ? "text-red-600" : "text-green-600"}>
                            {tech.overdueCount}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictive Analytics */}
        <TabsContent value="predictive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Predictive Analytics
              </CardTitle>
              <CardDescription>AI-powered predictions for component failures and maintenance needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveAnalytics.map((prediction, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{prediction.asset}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getRiskColor(prediction.riskLevel)}>{prediction.riskLevel} Risk</Badge>
                          <Badge variant="outline">Confidence: {prediction.confidence}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium">Predicted Failure Date</Label>
                          <p className="text-sm flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {prediction.predictedFailure}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Recommendation</Label>
                          <p className="text-sm">{prediction.recommendation}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Risk Indicators</Label>
                        <div className="mt-2 space-y-1">
                          {prediction.indicators.map((indicator, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <AlertTriangle className="h-3 w-3 text-yellow-500" />
                              {indicator}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance & Safety Reports */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Inspection Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Safety Inspections</span>
                    <span className="text-green-600">100% Complete</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Equipment Calibrations</span>
                    <span className="text-green-600">95% Complete</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Environmental Checks</span>
                    <span className="text-yellow-600">87% Complete</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Regulatory Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Monthly Safety Report</p>
                      <p className="text-sm text-muted-foreground">Due: Jan 31, 2024</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Ready</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Environmental Compliance</p>
                      <p className="text-sm text-muted-foreground">Due: Feb 15, 2024</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Equipment Certification</p>
                      <p className="text-sm text-muted-foreground">Due: Mar 1, 2024</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Export Compliance Reports</CardTitle>
              <CardDescription>Generate reports for audits and regulatory submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Safety Audit Report</span>
                  <span className="text-xs text-muted-foreground">PDF Export</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span>Maintenance Summary</span>
                  <span className="text-xs text-muted-foreground">Excel Export</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <CheckCircle className="h-6 w-6 mb-2" />
                  <span>Compliance Certificate</span>
                  <span className="text-xs text-muted-foreground">PDF Export</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
