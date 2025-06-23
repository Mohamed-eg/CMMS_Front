"use client"

import { useState, useCallback } from "react"
import { useDispatch } from "react-redux"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Camera, FileImage, AlertCircle, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export default function AddAssetForm({ isOpen, onClose, onSubmit }) {
  const dispatch = useDispatch()
  const [dragActive, setDragActive] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    equipmentName: "",
    equipmentId: "",
    stationName: "",
    photos: [],
  })

  const [errors, setErrors] = useState({})

  // Available station options
  const stationOptions = [
    "Al-Noor Gas Station - Riyadh",
    "Al-Salam Gas Station - Jeddah",
    "Al-Waha Gas Station - Dammam",
    "Al-Fanar Gas Station - Mecca",
    "Al-Reef Gas Station - Medina",
  ]

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  // Auto-generate equipment ID based on name
  const generateEquipmentId = (name) => {
    if (!name) return ""
    const prefix = name.toLowerCase().includes("pump")
      ? "PUMP"
      : name.toLowerCase().includes("tank")
        ? "TANK"
        : name.toLowerCase().includes("compressor")
          ? "COMP"
          : name.toLowerCase().includes("wash")
            ? "WASH"
            : "EQP"
    const timestamp = Date.now().toString().slice(-4)
    return `${prefix}-${timestamp}`
  }

  // Handle equipment name change and auto-generate ID
  const handleEquipmentNameChange = (value) => {
    handleInputChange("equipmentName", value)
    if (value && !formData.equipmentId) {
      handleInputChange("equipmentId", generateEquipmentId(value))
    }
  }

  // Handle file upload
  const handleFileUpload = useCallback((files) => {
    const validFiles = Array.from(files).filter((file) => {
      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`)
        return false
      }
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`)
        return false
      }
      return true
    })

    if (validFiles.length > 0) {
      const newPhotos = validFiles.map((file) => ({
        id: Date.now() + Math.random(),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      }))

      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos],
      }))

      toast.success(`${validFiles.length} photo(s) uploaded successfully`)
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
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileUpload(e.dataTransfer.files)
      }
    },
    [handleFileUpload],
  )

  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files)
    }
  }

  // Remove photo
  const removePhoto = (photoId) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((photo) => photo.id !== photoId),
    }))
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.equipmentName.trim()) newErrors.equipmentName = "Equipment name is required"
    if (!formData.equipmentId.trim()) newErrors.equipmentId = "Equipment ID is required"
    if (!formData.stationName) newErrors.stationName = "Station name is required"

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
      // Create asset data
      const assetData = {
        ...formData,
        createdAt: new Date().toISOString(),
        status: "Active",
        condition: "New",
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Call parent callback
      if (onSubmit) {
        onSubmit(assetData)
      }

      toast.success("Asset added successfully!")

      // Reset form
      setFormData({
        equipmentName: "",
        equipmentId: "",
        stationName: "",
        photos: [],
      })
      setErrors({})

      // Close form
      onClose()
    } catch (error) {
      console.error("Error adding asset:", error)
      toast.error("Failed to add asset. Please try again.")
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Add New Asset
          </DialogTitle>
          <DialogDescription>
            Register a new equipment asset in your gas station inventory. Fill out the required information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Equipment Name */}
          <div className="space-y-2">
            <Label htmlFor="equipmentName">Equipment Name *</Label>
            <Input
              id="equipmentName"
              placeholder="e.g., Fuel Pump #5, Storage Tank #3, Air Compressor"
              value={formData.equipmentName}
              onChange={(e) => handleEquipmentNameChange(e.target.value)}
              className={errors.equipmentName ? "border-red-500" : ""}
            />
            {errors.equipmentName && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.equipmentName}
              </p>
            )}
          </div>

          {/* Equipment ID */}
          <div className="space-y-2">
            <Label htmlFor="equipmentId">Equipment ID *</Label>
            <Input
              id="equipmentId"
              placeholder="e.g., PUMP-001, TANK-002, COMP-001"
              value={formData.equipmentId}
              onChange={(e) => handleInputChange("equipmentId", e.target.value)}
              className={errors.equipmentId ? "border-red-500" : ""}
            />
            <p className="text-xs text-muted-foreground">
              Auto-generated based on equipment name, but you can customize it
            </p>
            {errors.equipmentId && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.equipmentId}
              </p>
            )}
          </div>

          {/* Station Name */}
          <div className="space-y-2">
            <Label htmlFor="stationName">Station Name *</Label>
            <Select value={formData.stationName} onValueChange={(value) => handleInputChange("stationName", value)}>
              <SelectTrigger className={errors.stationName ? "border-red-500" : ""}>
                <SelectValue placeholder="Select station where this equipment is located..." />
              </SelectTrigger>
              <SelectContent>
                {stationOptions.map((station) => (
                  <SelectItem key={station} value={station}>
                    {station}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.stationName && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.stationName}
              </p>
            )}
          </div>

          {/* Photo Upload */}
          <div className="space-y-4">
            <Label>Equipment Photos</Label>
            <p className="text-sm text-muted-foreground">
              Upload photos of the equipment for identification and documentation purposes.
            </p>

            {/* Drag and Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Drag and drop photos here</p>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse files (JPG, PNG, GIF, WebP - Max 5MB each)
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                id="photo-upload"
              />
              <Button type="button" variant="outline" onClick={() => document.getElementById("photo-upload").click()}>
                <FileImage className="mr-2 h-4 w-4" />
                Choose Files
              </Button>
            </div>

            {/* Photo Previews */}
            {formData.photos.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Photos ({formData.photos.length})</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                          onClick={() => removePhoto(photo.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <div className="mt-1">
                          <p className="text-xs font-medium truncate">{photo.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(photo.size)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding Asset...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Add Asset
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
