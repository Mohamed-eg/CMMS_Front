"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, BarChart3, TrendingUp, Users, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReportsPage() {
  const reportTypes = [
    {
      id: "work-orders",
      title: "Work Orders Report",
      description: "Comprehensive report of all work orders with status and completion metrics",
      icon: FileText,
      category: "Operations",
      lastGenerated: "2024-01-15",
      frequency: "Daily",
    },
    {
      id: "asset-performance",
      title: "Asset Performance Report",
      description: "Performance metrics and maintenance history for all assets",
      icon: BarChart3,
      category: "Assets",
      lastGenerated: "2024-01-14",
      frequency: "Weekly",
    },
    {
      id: "technician-productivity",
      title: "Technician Productivity Report",
      description: "Individual and team productivity metrics and task completion rates",
      icon: Users,
      category: "HR",
      lastGenerated: "2024-01-15",
      frequency: "Weekly",
    },
    {
      id: "maintenance-trends",
      title: "Maintenance Trends Report",
      description: "Analysis of maintenance patterns and predictive insights",
      icon: TrendingUp,
      category: "Analytics",
      lastGenerated: "2024-01-13",
      frequency: "Monthly",
    },
    {
      id: "safety-compliance",
      title: "Safety Compliance Report",
      description: "Safety inspections, incidents, and compliance status",
      icon: AlertTriangle,
      category: "Safety",
      lastGenerated: "2024-01-12",
      frequency: "Monthly",
    },
    {
      id: "cost-analysis",
      title: "Cost Analysis Report",
      description: "Maintenance costs, budget analysis, and cost optimization insights",
      icon: BarChart3,
      category: "Finance",
      lastGenerated: "2024-01-10",
      frequency: "Monthly",
    },
  ]

  const kpiData = [
    {
      title: "Reports Generated",
      value: "47",
      change: "+12%",
      period: "This Month",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Avg Generation Time",
      value: "2.3s",
      change: "-15%",
      period: "Last 30 days",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Data Points",
      value: "15.2K",
      change: "+8%",
      period: "Total Analyzed",
      icon: BarChart3,
      color: "text-purple-600",
    },
    {
      title: "Export Downloads",
      value: "156",
      change: "+23%",
      period: "This Month",
      icon: Download,
      color: "text-orange-600",
    },
  ]

  const getCategoryColor = (category) => {
    switch (category) {
      case "Operations":
        return "bg-blue-100 text-blue-800"
      case "Assets":
        return "bg-green-100 text-green-800"
      case "HR":
        return "bg-purple-100 text-purple-800"
      case "Analytics":
        return "bg-orange-100 text-orange-800"
      case "Safety":
        return "bg-red-100 text-red-800"
      case "Finance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleGenerateReport = (reportId) => {
    console.log(`Generating report: ${reportId}`)
    // Here you would implement the actual report generation logic
  }

  const handleExportReport = (reportId, format) => {
    console.log(`Exporting report: ${reportId} as ${format}`)
    // Here you would implement the export functionality
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate comprehensive reports and analyze your gas station performance
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="text-green-600">{kpi.change}</span>
                <span className="ml-1">{kpi.period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>Generate and export various reports for your gas station operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportTypes.map((report) => (
              <Card key={report.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <report.icon className="h-5 w-5 text-muted-foreground" />
                      <Badge className={getCategoryColor(report.category)}>{report.category}</Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <CardDescription className="text-sm">{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Generated:</span>
                      <span>{report.lastGenerated}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frequency:</span>
                      <span>{report.frequency}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1" onClick={() => handleGenerateReport(report.id)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate
                      </Button>
                      <Select onValueChange={(format) => handleExportReport(report.id, format)}>
                        <SelectTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">Export as PDF</SelectItem>
                          <SelectItem value="csv">Export as CSV</SelectItem>
                          <SelectItem value="xlsx">Export as Excel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Recently generated reports and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: "Work Orders Report - January 2024",
                type: "Operations",
                generatedAt: "2024-01-15 10:30",
                size: "2.4 MB",
                format: "PDF",
                status: "Completed",
              },
              {
                name: "Asset Performance Report - Week 2",
                type: "Assets",
                generatedAt: "2024-01-14 16:45",
                size: "1.8 MB",
                format: "Excel",
                status: "Completed",
              },
              {
                name: "Technician Productivity - January",
                type: "HR",
                generatedAt: "2024-01-13 09:15",
                size: "956 KB",
                format: "PDF",
                status: "Completed",
              },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.type} • Generated {report.generatedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{report.size}</p>
                    <p className="text-xs text-muted-foreground">{report.format}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{report.status}</Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
