"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import AddAssetForm from "@/components/add-asset-form"
import { fetchAssets, fetchAssetStats } from "@/lib/api/assets"
import { toast } from "sonner"

export default function AssetsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [showAssetDetails, setShowAssetDetails] = useState(false)
  const [showAddAssetForm, setShowAddAssetForm] = useState(false)
  const [assets, setAssets] = useState([])
  const [assetStats, setAssetStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Default fallback data
  const defaultAssets = [
    {
      id: "AST-001",
      name: "Fuel Pump #1",
      category: "Fuel Dispensing",
      location: "Pump Island A",
      gpsCoordinates: "24.7136° N, 46.6753° E",
      status: "Active",
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-02-10",
      condition: "Good",
      serialNumber: "FP-2023-001",
      manufacturer: "Wayne Fueling Systems",
      installDate: "2023-03-15",
      expectedLifespan: "10 years",
      usageHours: 8760,
      flowRateAnomalies: 2,
      serviceFrequency: "Monthly",
      photos: ["/placeholder.svg?height=200&width=300"],
      specifications: {
        model: "Wayne Ovation II",
        fuelTypes: ["Gasoline 91", "Gasoline 95", "Diesel"],
        flowRate: "40 L/min",
        accuracy: "±0.3%",
      },
      maintenanceHistory: [
        { date: "2024-01-10", type: "Routine Inspection", technician: "Mohammed Al-Fahad", duration: "2 hours" },
        { date: "2023-12-15", type: "Calibration", technician: "Abdullah Al-Rashid", duration: "1.5 hours" },
      ],
    },
    {
      id: "AST-002",
      name: "Storage Tank #1",
      category: "Storage",
      location: "Underground Tank Farm",
      gpsCoordinates: "24.7136° N, 46.6753° E",
      status: "Active",
      lastMaintenance: "2024-01-05",
      nextMaintenance: "2024-04-05",
      condition: "Excellent",
      serialNumber: "ST-2022-001",
      manufacturer: "Containment Solutions",
      installDate: "2022-08-20",
      expectedLifespan: "15 years",
      usageHours: 4380,
      flowRateAnomalies: 0,
      serviceFrequency: "Annually",
      photos: ["/placeholder.svg?height=200&width=300"],
      specifications: {
        model: "CSI Double Wall",
        capacity: "20,000 liters",
        material: "Fiberglass",
        leakDetection: "Integrated sensor",
      },
      maintenanceHistory: [
        { date: "2024-01-05", type: "Integrity Test", technician: "Faisal Al-Khalid", duration: "3 hours" },
        { date: "2023-08-20", type: "Visual Inspection", technician: "Nasser Al-Salem", duration: "1 hour" },
      ],
    },
    {
      id: "AST-003",
      name: "Air Compressor Unit 1",
      category: "Utility",
      location: "Equipment Room",
      gpsCoordinates: "24.7136° N, 46.6753° E",
      status: "Maintenance Required",
      lastMaintenance: "2023-12-15",
      nextMaintenance: "2024-01-15",
      condition: "Fair",
      serialNumber: "AC-2021-003",
      manufacturer: "Atlas Copco",
      installDate: "2021-11-10",
      expectedLifespan: "8 years",
      usageHours: 6570,
      flowRateAnomalies: 5,
      serviceFrequency: "Bi-Annually",
      photos: ["/placeholder.svg?height=200&width=300"],
      specifications: {
        model: "GA 11 VSD+",
        power: "11 kW",
        pressure: "7-13 bar",
        airDelivery: "1.5-3.5 m³/min",
      },
      maintenanceHistory: [
        { date: "2023-12-15", type: "Filter Replacement", technician: "Saleh Al-Otaibi", duration: "2 hours" },
        { date: "2023-06-10", type: "Oil Change", technician: "Omar Al-Zahrani", duration: "1.5 hours" },
      ],
    },
    {
      id: "AST-004",
      name: "Fire Suppression System",
      category: "Safety",
      location: "Station Wide",
      gpsCoordinates: "24.7136° N, 46.6753° E",
      status: "Active",
      lastMaintenance: "2024-01-08",
      nextMaintenance: "2024-02-08",
      condition: "Good",
      serialNumber: "FS-2023-001",
      manufacturer: "Ansul",
      installDate: "2023-01-12",
      expectedLifespan: "12 years",
      usageHours: 0,
      flowRateAnomalies: 0,
      serviceFrequency: "Annually",
      photos: ["/placeholder.svg?height=200&width=300"],
      specifications: {
        model: "R-102",
        agentType: "Wet Chemical",
        coverageArea: "500 sq ft",
        dischargeTime: "60 seconds",
      },
      maintenanceHistory: [
        { date: "2024-01-08", type: "Pressure Check", technician: "Ziad Al-Ghamdi", duration: "1 hour" },
        { date: "2023-01-12", type: "System Inspection", technician: "Fahad Al-Dosari", duration: "2 hours" },
      ],
    },
  ]

  // Load assets data
  const loadAssets = async () => {
    try {
      setLoading(true)
      setError(null)

      const filters = {
        search: searchTerm,
        category: categoryFilter,
        status: statusFilter,
      }

      const [assetsData, statsData] = await Promise.all([fetchAssets(filters), fetchAssetStats()])

      setAssets(assetsData.assets || assetsData || [])
      setAssetStats(statsData || {})
      toast.success("Assets loaded successfully")
    } catch (err) {
      console.error("Error loading assets:", err)
      setError(err.message)
      setAssets(defaultAssets) // Use fallback data
      toast.error("Failed to load assets, showing cached data")
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount and when filters change
  useEffect(() => {
    // Comment out API call for now until backend is ready
    // loadAssets()

    // Use default data for now
    setAssets(defaultAssets)
    setLoading(false)
  }, [searchTerm, categoryFilter, statusFilter])

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Maintenance Required":
        return "bg-yellow-100 text-yellow-800"
      case "Out of Service":
        return "bg-red-100 text-red-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getConditionColor = (condition) => {
    switch (condition) {
      case "Excellent":
        return "bg-green-100 text-green-800"
      case "Good":
        return "bg-blue-100 text-blue-800"
      case "Fair":
        return "bg-yellow-100 text-yellow-800"
      case "Poor":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Maintenance Required":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "Out of Service":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || asset.category === categoryFilter
    const matchesStatus = statusFilter === "all" || asset.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleDeleteAsset = async (id) => {
    try {
      // Comment out API call for now
      // await deleteAsset(id)

      toast.success("Asset deleted successfully")
      loadAssets() // Refresh the list
    } catch (err) {
      console.error("Error deleting asset:", err)
      toast.error("Failed to delete asset")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading assets...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground">Manage and track all gas station assets and equipment</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadAssets} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowAddAssetForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Asset
          </Button>

          <AddAssetForm
            isOpen={showAddAssetForm}
            onClose={() => setShowAddAssetForm(false)}
            onSubmit={(assetData) => {
              console.log("New asset added:", assetData)
              toast.success(`Asset ${assetData.equipmentName} added successfully!`)
              loadAssets() // Refresh the list
            }}
          />
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
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
            <p className="text-xs text-muted-foreground">Registered assets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.filter((a) => a.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">Currently operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Due</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.filter((a) => a.status === "Maintenance Required").length}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Excellent Condition</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.filter((a) => a.condition === "Excellent").length}</div>
            <p className="text-xs text-muted-foreground">Top condition assets</p>
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
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Fuel Dispensing">Fuel Dispensing</SelectItem>
                <SelectItem value="Storage">Storage</SelectItem>
                <SelectItem value="Safety">Safety</SelectItem>
                <SelectItem value="Utility">Utility</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Maintenance Required">Maintenance Required</SelectItem>
                <SelectItem value="Out of Service">Out of Service</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assets ({filteredAssets.length})</CardTitle>
          <CardDescription>Complete inventory of all gas station assets</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Next Maintenance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-sm text-muted-foreground">{asset.manufacturer}</p>
                    </div>
                  </TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>{asset.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(asset.status)}
                      <Badge className={getStatusColor(asset.status)}>{asset.status}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getConditionColor(asset.condition)}>{asset.condition}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {asset.nextMaintenance}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedAsset(asset)
                          setShowAssetDetails(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteAsset(asset.id)}>
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
      {showAssetDetails && selectedAsset && (
        <Dialog open={showAssetDetails} onOpenChange={setShowAssetDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedAsset.name} - Detailed View</DialogTitle>
              <DialogDescription>Complete asset information and maintenance history</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6">
              {/* Asset Photos */}
              <div className="space-y-2">
                <h4 className="font-medium">Asset Photos</h4>
                <div className="grid grid-cols-3 gap-2">
                  {selectedAsset.photos?.map((photo, index) => (
                    <img
                      key={index}
                      src={photo || "/placeholder.svg"}
                      alt={`${selectedAsset.name} photo ${index + 1}`}
                      className="rounded-lg border"
                    />
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Specifications</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Model:</span> {selectedAsset.specifications?.model}
                    </p>
                    <p>
                      <span className="font-medium">Flow Rate:</span> {selectedAsset.specifications?.flowRate}
                    </p>
                    <p>
                      <span className="font-medium">Accuracy:</span> {selectedAsset.specifications?.accuracy}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Performance Metrics</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Usage Hours:</span> {selectedAsset.usageHours}
                    </p>
                    <p>
                      <span className="font-medium">Flow Rate Anomalies:</span> {selectedAsset.flowRateAnomalies}
                    </p>
                    <p>
                      <span className="font-medium">Expected Lifespan:</span> {selectedAsset.expectedLifespan}
                    </p>
                  </div>
                </div>
              </div>

              {/* Maintenance History */}
              <div className="space-y-2">
                <h4 className="font-medium">Recent Maintenance History</h4>
                <div className="space-y-2">
                  {selectedAsset.maintenanceHistory?.map((record, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{record.type}</p>
                          <p className="text-sm text-muted-foreground">By {record.technician}</p>
                        </div>
                        <div className="text-right text-sm">
                          <p>{record.date}</p>
                          <p className="text-muted-foreground">{record.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
