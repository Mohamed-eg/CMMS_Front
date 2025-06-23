"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, BarChart3, TrendingUp, Users, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function ReportsPage() {
  const reportTypes = [
    {
      id: "service-report",
      title: "Service Report",
      description: "Generate periodic inspection and maintenance service reports",
      icon: FileText,
      category: "Operations",
      lastGenerated: "2024-01-15",
      frequency: "Daily",
      isCustomForm: true,
    },
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

  const [showServiceReportForm, setShowServiceReportForm] = useState(false)
  const [serviceReportData, setServiceReportData] = useState({
    date: new Date().toISOString().split("T")[0],
    stationName: "Al-Rashid Gas Station",
    fuelDispenser: "",
    controlRoom: "",
    bathroom: "",
    supervisor: "",
    additionalNotes: "",
  })

  const handleGenerateServiceReport = () => {
    // Generate PDF content
    const reportContent = generateServiceReportHTML(serviceReportData)

    // Create and download PDF
    const printWindow = window.open("", "_blank")
    printWindow.document.write(reportContent)
    printWindow.document.close()
    printWindow.print()

    setShowServiceReportForm(false)
  }

  const generateServiceReportHTML = (data) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Service Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
          .date-section { margin-bottom: 20px; }
          .section { margin-bottom: 25px; }
          .section-title { font-weight: bold; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #000; padding: 12px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
          .signature-box { width: 45%; }
          .signature-line { border-bottom: 1px solid #000; margin-top: 30px; padding-bottom: 5px; }
          .checkbox { margin-right: 8px; }
          .maintenance-row { height: 60px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Service Report</div>
        </div>
        
        <div class="date-section">
          <strong>Date:</strong> ${data.date}
        </div>
        
        <div class="section">
          <p>Periodic Inspection & maintenance was carried out at <strong>${data.stationName}</strong> and included the following:</p>
          <ul>
            <li>☑ Fuel Dispenser inspection.</li>
            <li>☑ Bathroom.</li>
            <li>☑ Control room.</li>
            <li>☑ Accommodation</li>
          </ul>
        </div>
        
        <div class="section">
          <div class="section-title">Maintenance Service:</div>
          <table>
            <thead>
              <tr>
                <th style="width: 25%;">Section</th>
                <th style="width: 15%;">Date</th>
                <th style="width: 60%;">Maintenance Inspection & Service</th>
              </tr>
            </thead>
            <tbody>
              <tr class="maintenance-row">
                <td><strong>Fuel Dispenser</strong></td>
                <td>${data.date}</td>
                <td>${data.fuelDispenser || ""}</td>
              </tr>
              <tr class="maintenance-row">
                <td><strong>Control Room & Accommodation</strong></td>
                <td>${data.date}</td>
                <td>${data.controlRoom || ""}</td>
              </tr>
              <tr class="maintenance-row">
                <td><strong>Bathroom</strong></td>
                <td>${data.date}</td>
                <td>${data.bathroom || ""}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        ${
          data.additionalNotes
            ? `
        <div class="section">
          <div class="section-title">Additional Notes:</div>
          <p>${data.additionalNotes}</p>
        </div>
        `
            : ""
        }
        
        <div class="signature-section">
          <div class="signature-box">
            <strong>Station Supervisor</strong>
            <div class="signature-line">${data.supervisor || ""}</div>
          </div>
          <div class="signature-box">
            <strong>Signature</strong>
            <div class="signature-line"></div>
          </div>
        </div>
      </body>
      </html>
    `
  }

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
    if (reportId === "service-report") {
      setShowServiceReportForm(true)
    } else {
      console.log(`Generating report: ${reportId}`)
      // Here you would implement the actual report generation logic for other reports
    }
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

      {/* Service Report Form Dialog */}
      <Dialog open={showServiceReportForm} onOpenChange={setShowServiceReportForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate Service Report</DialogTitle>
            <DialogDescription>
              Fill in the maintenance details to generate a professional service report
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="report-date">Date</Label>
                <Input
                  id="report-date"
                  type="date"
                  value={serviceReportData.date}
                  onChange={(e) => setServiceReportData({ ...serviceReportData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="station-name">Station Name</Label>
                <Input
                  id="station-name"
                  value={serviceReportData.stationName}
                  onChange={(e) => setServiceReportData({ ...serviceReportData, stationName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuel-dispenser">Fuel Dispenser - Maintenance Inspection & Service</Label>
              <Textarea
                id="fuel-dispenser"
                placeholder="Describe fuel dispenser maintenance activities..."
                value={serviceReportData.fuelDispenser}
                onChange={(e) => setServiceReportData({ ...serviceReportData, fuelDispenser: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="control-room">Control Room & Accommodation - Maintenance Inspection & Service</Label>
              <Textarea
                id="control-room"
                placeholder="Describe control room and accommodation maintenance activities..."
                value={serviceReportData.controlRoom}
                onChange={(e) => setServiceReportData({ ...serviceReportData, controlRoom: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathroom">Bathroom - Maintenance Inspection & Service</Label>
              <Textarea
                id="bathroom"
                placeholder="Describe bathroom maintenance activities..."
                value={serviceReportData.bathroom}
                onChange={(e) => setServiceReportData({ ...serviceReportData, bathroom: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supervisor">Station Supervisor Name</Label>
              <Input
                id="supervisor"
                placeholder="Enter supervisor name"
                value={serviceReportData.supervisor}
                onChange={(e) => setServiceReportData({ ...serviceReportData, supervisor: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional-notes">Additional Notes (Optional)</Label>
              <Textarea
                id="additional-notes"
                placeholder="Any additional maintenance notes or observations..."
                value={serviceReportData.additionalNotes}
                onChange={(e) => setServiceReportData({ ...serviceReportData, additionalNotes: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowServiceReportForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateServiceReport}>
              <FileText className="mr-2 h-4 w-4" />
              Generate & Export PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
