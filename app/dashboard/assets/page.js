"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
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
import { fetchAssets, fetchAssetStats, deleteExistingAsset, createNewAsset } from "@/lib/features/assets/assetsSlice"
import { toast } from "sonner"
import { formatDate } from "@/lib/helper"
import { useRouter } from "next/navigation"

export default function AssetsPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const assets = useSelector((state) => state.assets.assets)
  const stats = useSelector((state) => state.assets.stats)
  const loading = useSelector((state) => state.assets.loading)
  const error = useSelector((state) => state.assets.error)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [showAssetDetails, setShowAssetDetails] = useState(false)
  const [showAddAssetForm, setShowAddAssetForm] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Check user role and redirect technicians
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      const userRole = user.role?.toLowerCase() || user.Role?.toLowerCase()
      if (userRole === "technician") {
        router.push("/dashboard/technician")
        return
      }
    }
  }, [router])

  // Load assets data
  const loadAssets = async () => {
    try {
      setIsRefreshing(true)
      const filters = {
        search: searchTerm,
        category: categoryFilter,
        status: statusFilter,
      }

      await Promise.all([
        dispatch(fetchAssets(filters)).unwrap(),
        dispatch(fetchAssetStats()).unwrap()
      ])

      toast.success("Assets loaded successfully")
    } catch (err) {
      console.error("Error loading assets:", err)
      toast.error("Failed to load assets")
    } finally {
      setIsRefreshing(false)
    }
  }

  // Load data on component mount and when filters change
  useEffect(() => {
    loadAssets()
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
      await dispatch(deleteExistingAsset(id)).unwrap()
      toast.success("Asset deleted successfully")
    } catch (err) {
      console.error("Error deleting asset:", err)
      toast.error("Failed to delete asset")
    }
  }

  const handleRefresh = async () => {
    await loadAssets()
  }

  if (loading && !isRefreshing) {
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
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowAddAssetForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Asset
          </Button>

          <AddAssetForm
            isOpen={showAddAssetForm}
            onClose={() => setShowAddAssetForm(false)}
            onSubmit={async (assetData) => {
              try {
                await dispatch(createNewAsset(assetData)).unwrap()
                toast.success(`Asset ${assetData.name} added successfully!`)
                setShowAddAssetForm(false) // Close the form
              } catch (error) {
                console.error("Error creating asset:", error)
                if (error.message?.includes("duplicate") || error.message?.includes("already exists")) {
                  toast.error("Asset with this ID already exists")
                } else if (error.message?.includes("validation")) {
                  toast.error("Please check your input data")
                } else {
                  toast.error("Failed to create asset. Please try again.")
                }
              }
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
                      {formatDate(asset.nextMaintenance)}
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
