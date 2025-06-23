"use client"

import { useState, useCallback } from "react"
import { useDispatch } from "react-redux"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, FileImage, AlertCircle, CheckCircle2, Building } from "lucide-react"
import { toast } from "sonner"

export default function AddStationForm({ isOpen, onClose, onSubmit }) {
  const dispatch = useDispatch()
  const [dragActive, setDragActive] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    // Basic Information
    stationName: "",
    stationCode: "",
    licenseNumber: "",
    stationType: "",

    // Location Information
    address: "",
    city: "",
    region: "",
    postalCode: "",
    gpsCoordinates: "",
    totalArea: "",

    // Contact Information
    phone: "",
    email: "",
    managerName: "",

    // Operational Information
    operatingHours: "",
    fuelBrands: [],
    establishedDate: "",

    // Documentation
    photos: [],
    documents: [],
  })

  const [errors, setErrors] = useState({})

  // Available options
  const stationTypes = [
    "Full Service Gas Station",
    "Self-Service Gas Station",
    "Truck Stop",
    "Highway Service Station",
    "Urban Gas Station",
    "Rural Gas Station",
  ]

  const regionOptions = [
    "Riyadh Region",
    "Makkah Region",
    "Eastern Province",
    "Asir Region",
    "Jazan Region",
    "Tabuk Region",
    "Hail Region",
    "Northern Borders",
    "Najran Region",
    "Al Bahah Region",
    "Al Jouf Region",
    "Qassim Region",
    "Madinah Region",
  ]

  const fuelBrandOptions = ["Saudi Aramco", "ADNOC", "Shell", "Mobil", "Total", "BP"]

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  // Auto-generate station code based on name and city
  const generateStationCode = (name, city) => {
    if (!name || !city) return ""
    const namePrefix = name.split(" ")[0].substring(0, 3).toUpperCase()
    const cityPrefix = city.substring(0, 3).toUpperCase()
    const timestamp = Date.now().toString().slice(-3)
    return `${namePrefix}-${cityPrefix}-${timestamp}`
  }

  // Handle station name change and auto-generate code
  const handleStationNameChange = (value) => {
    handleInputChange("stationName", value)
    if (value && formData.city && !formData.stationCode) {
      handleInputChange("stationCode", generateStationCode(value, formData.city))
    }
  }

  // Handle city change and update station code
  const handleCityChange = (value) => {
    handleInputChange("city", value)
    if (formData.stationName && value) {
      handleInputChange("stationCode", generateStationCode(formData.stationName, value))
    }
  }

  // Handle fuel brands selection
  const handleFuelBrandToggle = (brand) => {
    const currentBrands = formData.fuelBrands || []
    const updatedBrands = currentBrands.includes(brand)
      ? currentBrands.filter((b) => b !== brand)
      : [...currentBrands, brand]
    handleInputChange("fuelBrands", updatedBrands)
  }

  // Handle file upload
  const handleFileUpload = useCallback((files, type = "photos") => {
    const validFiles = Array.from(files).filter((file) => {
      // Check file type based on upload type
      if (type === "photos" && !file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`)
        return false
      }
      // Check file size (10MB limit for documents, 5MB for photos)
      const maxSize = type === "documents" ? 10 * 1024 * 1024 : 5 * 1024 * 1024
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large (max ${type === "documents" ? "10MB" : "5MB"})`)
        return false
      }
      return true
    })

    if (validFiles.length > 0) {
      const newFiles = validFiles.map((file) => ({
        id: Date.now() + Math.random(),
        file,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
        name: file.name,
        size: file.size,
        type: file.type,
      }))

      setFormData((prev) => ({
        ...prev,
        [type]: [...prev[type], ...newFiles],
      }))

      toast.success(`${validFiles.length} ${type} uploaded successfully`)
    }
  }, [])

  // Handle drag and drop
  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e, type = "photos") => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileUpload(e.dataTransfer.files, type)
      }
    },
    [handleFileUpload],
  )

  // Remove file
  const removeFile = (fileId, type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((file) => file.id !== fileId),
    }))
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    // Basic Information
    if (!formData.stationName.trim()) newErrors.stationName = "Station name is required"
    if (!formData.stationCode.trim()) newErrors.stationCode = "Station code is required"
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "License number is required"
    if (!formData.stationType) newErrors.stationType = "Station type is required"

    // Location Information
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.region) newErrors.region = "Region is required"

    // Contact Information
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.managerName.trim()) newErrors.managerName = "Manager name is required"

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // Create station data
      const stationData = {
        ...formData,
        createdAt: new Date().toISOString(),
        status: "Active",
        id: `STN-${Date.now()}`,
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Call parent callback
      if (onSubmit) {
        onSubmit(stationData)
      }

      toast.success("Station added successfully!")

      // Reset form
      setFormData({
        stationName: "",
        stationCode: "",
        licenseNumber: "",
        stationType: "",
        address: "",
        city: "",
        region: "",
        postalCode: "",
        gpsCoordinates: "",
        totalArea: "",
        phone: "",
        email: "",
        managerName: "",
        operatingHours: "",
        fuelBrands: [],
        establishedDate: "",
        photos: [],
        documents: [],
      })
      setErrors({})

      // Close form
      onClose()
    } catch (error) {
      console.error("Error adding station:", error)
      toast.error("Failed to add station. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Add New Gas Station
          </DialogTitle>
          <DialogDescription>
            Register a new gas station in your network. Complete all required information across the different sections.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stationName">Station Name *</Label>
                  <Input
                    id="stationName"
                    placeholder="e.g., Al-Noor Gas Station"
                    value={formData.stationName}
                    onChange={(e) => handleStationNameChange(e.target.value)}
                    className={errors.stationName ? "border-red-500" : ""}
                  />
                  {errors.stationName && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.stationName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stationCode">Station Code *</Label>
                  <Input
                    id="stationCode"
                    placeholder="e.g., ALN-RYD-001"
                    value={formData.stationCode}
                    onChange={(e) => handleInputChange("stationCode", e.target.value)}
                    className={errors.stationCode ? "border-red-500" : ""}
                  />
                  <p className="text-xs text-muted-foreground">Auto-generated based on station name and city</p>
                  {errors.stationCode && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.stationCode}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number *</Label>
                  <Input
                    id="licenseNumber"
                    placeholder="e.g., GS-2024-001"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                    className={errors.licenseNumber ? "border-red-500" : ""}
                  />
                  {errors.licenseNumber && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.licenseNumber}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stationType">Station Type *</Label>
                  <Select
                    value={formData.stationType}
                    onValueChange={(value) => handleInputChange("stationType", value)}
                  >
                    <SelectTrigger className={errors.stationType ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select station type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {stationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.stationType && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.stationType}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="establishedDate">Established Date</Label>
                  <Input
                    id="establishedDate"
                    type="date"
                    value={formData.establishedDate}
                    onChange={(e) => handleInputChange("establishedDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operatingHours">Operating Hours</Label>
                  <Input
                    id="operatingHours"
                    placeholder="e.g., 24/7 or 6:00 AM - 10:00 PM"
                    value={formData.operatingHours}
                    onChange={(e) => handleInputChange("operatingHours", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fuel Brands</Label>
                <div className="flex flex-wrap gap-2">
                  {fuelBrandOptions.map((brand) => (
                    <Button
                      key={brand}
                      type="button"
                      variant={formData.fuelBrands?.includes(brand) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFuelBrandToggle(brand)}
                    >
                      {brand}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Location Information Tab */}
            <TabsContent value="location" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Full Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter complete street address..."
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="e.g., Riyadh"
                    value={formData.city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.city}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region *</Label>
                  <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                    <SelectTrigger className={errors.region ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select region..." />
                    </SelectTrigger>
                    <SelectContent>
                      {regionOptions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.region && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.region}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    placeholder="e.g., 12345"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalArea">Total Area</Label>
                  <Input
                    id="totalArea"
                    placeholder="e.g., 2,500 sqm"
                    value={formData.totalArea}
                    onChange={(e) => handleInputChange("totalArea", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gpsCoordinates">GPS Coordinates</Label>
                <Input
                  id="gpsCoordinates"
                  placeholder="e.g., 24.7136° N, 46.6753° E"
                  value={formData.gpsCoordinates}
                  onChange={(e) => handleInputChange("gpsCoordinates", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Enter GPS coordinates for precise location mapping
                </p>
              </div>
            </TabsContent>

            {/* Contact Information Tab */}
            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="e.g., +966 11 456 7890"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g., info@station.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="managerName">Station Manager Name *</Label>
                <Input
                  id="managerName"
                  placeholder="e.g., Omar Al-Noor"
                  value={formData.managerName}
                  onChange={(e) => handleInputChange("managerName", e.target.value)}
                  className={errors.managerName ? "border-red-500" : ""}
                />
                {errors.managerName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.managerName}
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              {/* Station Photos */}
              <div className="space-y-4">
                <Label>Station Photos</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={(e) => handleDrop(e, "photos")}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">Upload Station Photos</p>
                  <p className="text-sm text-gray-500 mb-4">JPG, PNG, GIF, WebP - Max 5MB each</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files, "photos")}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("photo-upload").click()}
                  >
                    <FileImage className="mr-2 h-4 w-4" />
                    Choose Photos
                  </Button>
                </div>

                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {formData.photos.map((photo) => (
                      <Card key={photo.id} className="relative">
                        <CardContent className="p-2">
                          <img
                            src={photo.preview || "/placeholder.svg"}
                            alt={photo.name}
                            className="w-full h-24 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => removeFile(photo.id, "photos")}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <p className="text-xs font-medium truncate mt-1">{photo.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <Label>Legal Documents & Certificates</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={(e) => handleDrop(e, "documents")}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">Upload Documents</p>
                  <p className="text-sm text-gray-500 mb-4">PDF, DOC, DOCX - Max 10MB each</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e.target.files, "documents")}
                    className="hidden"
                    id="document-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("document-upload").click()}
                  >
                    <FileImage className="mr-2 h-4 w-4" />
                    Choose Documents
                  </Button>
                </div>

                {formData.documents.length > 0 && (
                  <div className="space-y-2">
                    {formData.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">{formatFileSize(doc.size)}</p>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFile(doc.id, "documents")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding Station...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Add Station
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
