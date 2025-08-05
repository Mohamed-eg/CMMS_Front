"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Plus, X, Upload, MapPin } from "lucide-react"

export default function AddAssetForm({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    assetCode: "",
    category: "",
    location: "",
    gpsCoordinates: "",
    status: "Active",
    lastMaintenance: "",
    nextMaintenance: "",
    condition: "Good",
    serialNumber: "",
    manufacturer: "",
    installDate: "",
    expectedLifespan: "",
    usageHours: "",
    flowRateAnomalies: "",
    serviceFrequency: "",
    photos: [],
    specifications: {
      model: "",
      capacity: "",
      power: "",
      flowRate: "",
      accuracy: "",
      material: "",
      leakDetection: "",
      agentType: "",
      coverageArea: "",
      dischargeTime: "",
      fuelTypes: [],
      efficiency: "",
      pressure: "",
      airDelivery: ""
    },
    maintenanceHistory: []
  })
  const [loading, setLoading] = useState(false)
  const [photoUrl, setPhotoUrl] = useState("")
  const [newMaintenanceRecord, setNewMaintenanceRecord] = useState({
    date: "",
    type: "",
    technician: "",
    duration: ""
  })
  const [gettingLocation, setGettingLocation] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSpecificationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value
      }
    }))
  }

  const addPhoto = () => {
    if (photoUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, photoUrl.trim()]
      }))
      setPhotoUrl("")
    }
  }

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const addMaintenanceRecord = () => {
    if (newMaintenanceRecord.date && newMaintenanceRecord.type && newMaintenanceRecord.technician && newMaintenanceRecord.duration) {
      setFormData(prev => ({
        ...prev,
        maintenanceHistory: [...prev.maintenanceHistory, { ...newMaintenanceRecord }]
      }))
      setNewMaintenanceRecord({ date: "", type: "", technician: "", duration: "" })
    }
  }

  const removeMaintenanceRecord = (index) => {
    setFormData(prev => ({
      ...prev,
      maintenanceHistory: prev.maintenanceHistory.filter((_, i) => i !== index)
    }))
  }
// Get current location
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    toast.error("Geolocation is not supported by this browser")
    return
  }

  setGettingLocation(true)
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      const coordinates = `${latitude.toFixed(6)}° N, ${longitude.toFixed(6)}° E`
      handleInputChange("gpsCoordinates", coordinates)
      toast.success("Current location captured successfully!")
      setGettingLocation(false)
    },
    (error) => {
      console.error("Error getting location:", error)
      let errorMessage = "Failed to get current location"
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location access denied. Please allow location access and try again."
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information unavailable. Please try again."
          break
        case error.TIMEOUT:
          errorMessage = "Location request timed out. Please try again."
          break
        default:
          errorMessage = "Failed to get current location. Please enter manually."
      }
      
      toast.error(errorMessage)
      setGettingLocation(false)
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }
  )
}
 

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    const requiredFields = ['id', 'name', 'assetCode', 'category', 'location', 'gpsCoordinates', 'status']
    const missingFields = requiredFields.filter(field => !formData[field])
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in required fields: ${missingFields.join(', ')}`)
      return
    }

    setLoading(true)
    try {
      // Convert string values to appropriate types
      const processedData = {
        ...formData,
        usageHours: formData.usageHours ? Number(formData.usageHours) : null,
        flowRateAnomalies: formData.flowRateAnomalies ? Number(formData.flowRateAnomalies) : null,
        lastMaintenance: formData.lastMaintenance ? new Date(formData.lastMaintenance) : null,
        nextMaintenance: formData.nextMaintenance ? new Date(formData.nextMaintenance) : null,
        installDate: formData.installDate ? new Date(formData.installDate) : null,
        maintenanceHistory: formData.maintenanceHistory.map(record => ({
          ...record,
          date: new Date(record.date)
        }))
      }

      await onSubmit(processedData)
      toast.success("Asset created successfully")
      onClose()
      // Reset form
      setFormData({
        id: "",
        name: "",
        assetCode: "",
        category: "",
        location: "",
        gpsCoordinates: "",
        status: "Active",
        lastMaintenance: "",
        nextMaintenance: "",
        condition: "Good",
        serialNumber: "",
        manufacturer: "",
        installDate: "",
        expectedLifespan: "",
        usageHours: "",
        flowRateAnomalies: "",
        serviceFrequency: "",
        photos: [],
        specifications: {
          model: "",
          capacity: "",
          power: "",
          flowRate: "",
          accuracy: "",
          material: "",
          leakDetection: "",
          agentType: "",
          coverageArea: "",
          dischargeTime: "",
          fuelTypes: [],
          efficiency: "",
          pressure: "",
          airDelivery: ""
        },
        maintenanceHistory: []
      })
    } catch (error) {
      toast.error("Failed to create asset")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
          <DialogDescription>Create a new asset for your gas station inventory.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Asset ID *</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) => handleInputChange("id", e.target.value)}
                    placeholder="AST-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assetCode">Asset Code *</Label>
                  <Input
                    id="assetCode"
                    value={formData.assetCode}
                    onChange={(e) => handleInputChange("assetCode", e.target.value)}
                    placeholder="PUMP-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Asset Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Fuel Pump #1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fuel Dispensing">Fuel Dispensing</SelectItem>
                      <SelectItem value="Storage">Storage</SelectItem>
                      <SelectItem value="Safety">Safety</SelectItem>
                      <SelectItem value="Utility">Utility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Pump Island A"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpsCoordinates">GPS Coordinates *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="gpsCoordinates"
                      value={formData.gpsCoordinates}
                      onChange={(e) => handleInputChange("gpsCoordinates", e.target.value)}
                      placeholder="24.7136° N, 46.6753° E"
                      required
                    />
                    <Button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={gettingLocation}
                      variant="outline"
                    >
                      {gettingLocation ? "Getting..." : "Get Current Location"}
                      <MapPin className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Maintenance Required">Maintenance Required</SelectItem>
                      <SelectItem value="Out of Service">Out of Service</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Technical Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={formData.serialNumber}
                    onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                    placeholder="SN-2023-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => handleInputChange("manufacturer", e.target.value)}
                    placeholder="Wayne Fueling Systems"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="installDate">Install Date</Label>
                  <Input
                    id="installDate"
                    type="date"
                    value={formData.installDate}
                    onChange={(e) => handleInputChange("installDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedLifespan">Expected Lifespan</Label>
                  <Input
                    id="expectedLifespan"
                    value={formData.expectedLifespan}
                    onChange={(e) => handleInputChange("expectedLifespan", e.target.value)}
                    placeholder="10 years"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usageHours">Usage Hours</Label>
                  <Input
                    id="usageHours"
                    type="number"
                    value={formData.usageHours}
                    onChange={(e) => handleInputChange("usageHours", e.target.value)}
                    placeholder="8760"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flowRateAnomalies">Flow Rate Anomalies</Label>
                  <Input
                    id="flowRateAnomalies"
                    type="number"
                    value={formData.flowRateAnomalies}
                    onChange={(e) => handleInputChange("flowRateAnomalies", e.target.value)}
                    placeholder="2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceFrequency">Service Frequency</Label>
                  <Input
                    id="serviceFrequency"
                    value={formData.serviceFrequency}
                    onChange={(e) => handleInputChange("serviceFrequency", e.target.value)}
                    placeholder="Monthly"
                  />
                </div>
              </div>
            </div>

            {/* Maintenance Schedule */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Maintenance Schedule</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastMaintenance">Last Maintenance</Label>
                  <Input
                    id="lastMaintenance"
                    type="date"
                    value={formData.lastMaintenance}
                    onChange={(e) => handleInputChange("lastMaintenance", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextMaintenance">Next Maintenance</Label>
                  <Input
                    id="nextMaintenance"
                    type="date"
                    value={formData.nextMaintenance}
                    onChange={(e) => handleInputChange("nextMaintenance", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.specifications.model}
                    onChange={(e) => handleSpecificationChange("model", e.target.value)}
                    placeholder="Wayne Ovation II"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    value={formData.specifications.capacity}
                    onChange={(e) => handleSpecificationChange("capacity", e.target.value)}
                    placeholder="30,000 liters"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="power">Power</Label>
                  <Input
                    id="power"
                    value={formData.specifications.power}
                    onChange={(e) => handleSpecificationChange("power", e.target.value)}
                    placeholder="1000 W"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flowRate">Flow Rate</Label>
                  <Input
                    id="flowRate"
                    value={formData.specifications.flowRate}
                    onChange={(e) => handleSpecificationChange("flowRate", e.target.value)}
                    placeholder="40 L/min"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accuracy">Accuracy</Label>
                  <Input
                    id="accuracy"
                    value={formData.specifications.accuracy}
                    onChange={(e) => handleSpecificationChange("accuracy", e.target.value)}
                    placeholder="±0.3%"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    value={formData.specifications.material}
                    onChange={(e) => handleSpecificationChange("material", e.target.value)}
                    placeholder="Fiberglass"
                  />
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Photos</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter photo URL"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                  <Button type="button" onClick={addPhoto} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img src={photo} alt={`Asset photo ${index + 1}`} className="w-full h-20 object-cover rounded" />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removePhoto(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Maintenance History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Maintenance History</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  <Input
                    placeholder="Date"
                    type="date"
                    value={newMaintenanceRecord.date}
                    onChange={(e) => setNewMaintenanceRecord(prev => ({ ...prev, date: e.target.value }))}
                  />
                  <Input
                    placeholder="Type"
                    value={newMaintenanceRecord.type}
                    onChange={(e) => setNewMaintenanceRecord(prev => ({ ...prev, type: e.target.value }))}
                  />
                  <Input
                    placeholder="Technician"
                    value={newMaintenanceRecord.technician}
                    onChange={(e) => setNewMaintenanceRecord(prev => ({ ...prev, technician: e.target.value }))}
                  />
                  <Input
                    placeholder="Duration"
                    value={newMaintenanceRecord.duration}
                    onChange={(e) => setNewMaintenanceRecord(prev => ({ ...prev, duration: e.target.value }))}
                  />
                </div>
                <Button type="button" onClick={addMaintenanceRecord} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Record
                </Button>
                {formData.maintenanceHistory.length > 0 && (
                  <div className="space-y-2">
                    {formData.maintenanceHistory.map((record, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded">
                        <span className="text-sm">{record.date}</span>
                        <span className="text-sm">{record.type}</span>
                        <span className="text-sm">{record.technician}</span>
                        <span className="text-sm">{record.duration}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => removeMaintenanceRecord(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Asset"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
