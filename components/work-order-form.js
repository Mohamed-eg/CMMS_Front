"use client"

import { useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Camera, FileImage, AlertCircle, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { submitWorkOrder, selectWorkOrdersSubmitting } from "@/lib/features/workOrders/workOrdersSlice"

export default function WorkOrderForm({ isOpen, onClose, onSubmit }) {
  const dispatch = useDispatch()
  const isSubmitting = useSelector(selectWorkOrdersSubmitting)
  const [dragActive, setDragActive] = useState(false)

  const [formData, setFormData] = useState({
    equipmentId: "",
    stationName: "",
    description: "",
    priority: "",
    urgency: "",
    photos: [],
  })

  const [errors, setErrors] = useState({})

  // Available options
  const equipmentOptions = [
    { id: "DISP-001", name: "Fuel Dispenser A1", type: "Fuel Dispenser" },
    { id: "DISP-002", name: "Fuel Dispenser A2", type: "Fuel Dispenser" },
    { id: "DISP-003", name: "Fuel Dispenser B1", type: "Fuel Dispenser" },
    { id: "TANK-001", name: "Storage Tank #1 (Gasoline)", type: "Storage Tank" },
    { id: "TANK-002", name: "Storage Tank #2 (Diesel)", type: "Storage Tank" },
    { id: "NOZZLE-001", name: "Nozzle A1-1", type: "Nozzle" },
    { id: "NOZZLE-002", name: "Nozzle A1-2", type: "Nozzle" },
    { id: "HOSE-001", name: "Hose A1-1", type: "Hose" },
    { id: "COMP-001", name: "Air Compressor", type: "Compressor" },
    { id: "WASH-001", name: "Car Wash System", type: "Car Wash" },
  ]

  const stationOptions = [
    "Al-Noor Gas Station - Riyadh",
    "Al-Salam Gas Station - Jeddah",
    "Al-Waha Gas Station - Dammam",
    "Al-Fanar Gas Station - Mecca",
    "Al-Reef Gas Station - Medina",
  ]

  const priorityOptions = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "High", color: "bg-red-100 text-red-800" },
  ]

  const urgencyOptions = [
    { value: "routine", label: "Routine" },
    { value: "scheduled", label: "Scheduled" },
    { value: "immediate", label: "Immediate" },
  ]

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
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

    if (!formData.equipmentId) newErrors.equipmentId = "Equipment ID is required"
    if (!formData.stationName) newErrors.stationName = "Station name is required"
    if (!formData.description.trim()) newErrors.description = "Issue description is required"
    if (!formData.priority) newErrors.priority = "Priority is required"
    if (!formData.urgency) newErrors.urgency = "Urgency is required"

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

    try {
      // Create work order data
      const workOrderData = {
        ...formData,
        submittedBy: "Current User", // This would come from auth context
      }

      // Dispatch to Redux store
      const result = await dispatch(submitWorkOrder(workOrderData))

      if (submitWorkOrder.fulfilled.match(result)) {
        // Call parent callback
        onSubmit(result.payload)

        toast.success("Work order submitted successfully!")

        // Reset form
        setFormData({
          equipmentId: "",
          stationName: "",
          description: "",
          priority: "",
          urgency: "",
          photos: [],
        })

        // Close form
        onClose()
      } else {
        throw new Error("Failed to submit work order")
      }
    } catch (error) {
      console.error("Error submitting work order:", error)
      toast.error("Failed to submit work order. Please try again.")
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
            Submit New Work Order
          </DialogTitle>
          <DialogDescription>
            Fill out the form below to submit a new maintenance request. Include photos of the equipment for faster
            diagnosis.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Equipment ID */}
          <div className="space-y-2">
            <Label htmlFor="equipmentId">Equipment ID *</Label>
            <Select value={formData.equipmentId} onValueChange={(value) => handleInputChange("equipmentId", value)}>
              <SelectTrigger className={errors.equipmentId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select equipment..." />
              </SelectTrigger>
              <SelectContent>
                {equipmentOptions.map((equipment) => (
                  <SelectItem key={equipment.id} value={equipment.id}>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{equipment.id}</span>
                      <span className="text-sm text-muted-foreground ml-2">{equipment.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <SelectValue placeholder="Select station..." />
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

          {/* Priority and Urgency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger className={errors.priority ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select priority..." />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <Badge className={priority.color}>{priority.label}</Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.priority}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency *</Label>
              <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                <SelectTrigger className={errors.urgency ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select urgency..." />
                </SelectTrigger>
                <SelectContent>
                  {urgencyOptions.map((urgency) => (
                    <SelectItem key={urgency.value} value={urgency.value}>
                      {urgency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.urgency && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.urgency}
                </p>
              )}
            </div>
          </div>

          {/* Issue Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Issue Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the issue in detail. Include any error messages, symptoms, or observations..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Photo Upload */}
          <div className="space-y-4">
            <Label>Equipment Photos</Label>

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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Submit Work Order
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
