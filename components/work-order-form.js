"use client"

import { useState, useEffect, useCallback } from "react"
import { useDispatch } from "react-redux"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  X,
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
  Camera,
  Wrench,
  Fuel,
  Shield,
  Zap,
  Building,
  Check,
  ChevronsUpDown,
} from "lucide-react"
import { submitWorkOrder } from "@/lib/features/workOrders/workOrdersSlice"
import { searchAssets } from "@/lib/api/assets"
import { toast } from "sonner"

const WorkOrderForm = ({ isOpen, onClose, onSubmit }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    title: "",
    equipmentId: "",
    equipmentName: "",
    stationName: "",
    priority: "",
    status: "Open",
    description: "",
    photos: [],
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [equipmentSearch, setEquipmentSearch] = useState("")
  const [equipmentResults, setEquipmentResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const [equipmentOpen, setEquipmentOpen] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState(null)

  // Equipment type icons
  const getEquipmentIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "fuel dispenser":
      case "fuel pump":
        return <Fuel className="h-4 w-4" />
      case "compressor":
      case "air compressor":
        return <Zap className="h-4 w-4" />
      case "fire system":
      case "safety":
        return <Shield className="h-4 w-4" />
      case "storage tank":
        return <Building className="h-4 w-4" />
      default:
        return <Wrench className="h-4 w-4" />
    }
  }

  // Equipment type badge colors
  const getEquipmentBadgeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "fuel dispenser":
      case "fuel pump":
        return "bg-blue-100 text-blue-800"
      case "compressor":
      case "air compressor":
        return "bg-yellow-100 text-yellow-800"
      case "fire system":
      case "safety":
        return "bg-red-100 text-red-800"
      case "storage tank":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      if (!searchTerm.trim()) {
        setEquipmentResults([])
        return
      }

      setIsSearching(true)
      setSearchError(null)

      try {
        console.log("🔍 Searching for equipment:", searchTerm)
        const results = await searchAssets(searchTerm)
        console.log("✅ Search results:", results)
        setEquipmentResults(results || [])
      } catch (error) {
        console.error("❌ Equipment search error:", error)
        setSearchError(error.message)
        setEquipmentResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300),
    [],
  )

  // Handle equipment search
  useEffect(() => {
    debouncedSearch(equipmentSearch)
  }, [equipmentSearch, debouncedSearch])

  // Handle equipment selection
  const handleEquipmentSelect = (equipment) => {
    console.log("🎯 Selected equipment:", equipment)
    setSelectedEquipment(equipment)
    setFormData((prev) => ({
      ...prev,
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      stationName: equipment.station || equipment.stationName || "",
    }))
    setEquipmentSearch(equipment.name)
    setEquipmentOpen(false)

    // Clear any previous errors
    if (errors.equipmentId) {
      setErrors((prev) => ({ ...prev, equipmentId: "" }))
    }
  }

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  // Handle photo upload
  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files)

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newPhoto = {
            id: Date.now() + Math.random(),
            file,
            preview: e.target.result,
            name: file.name,
            size: file.size,
          }

          setFormData((prev) => ({
            ...prev,
            photos: [...prev.photos, newPhoto],
          }))
        }
        reader.readAsDataURL(file)
      }
    })

    // Reset input
    event.target.value = ""
  }

  // Handle photo removal
  const removePhoto = (photoId) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((photo) => photo.id !== photoId),
    }))
  }

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))

    imageFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newPhoto = {
          id: Date.now() + Math.random(),
          file,
          preview: e.target.result,
          name: file.name,
          size: file.size,
        }

        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, newPhoto],
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  // Form validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Work order title is required"
    }

    if (!formData.equipmentId) {
      newErrors.equipmentId = "Equipment selection is required"
    }

    if (!formData.priority) {
      newErrors.priority = "Priority level is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Issue description is required"
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
      // Prepare work order data
      const workOrderData = {
        id: `WO-${Date.now()}`,
        title: formData.title,
        equipmentId: formData.equipmentId,
        equipmentName: formData.equipmentName,
        stationName: formData.stationName,
        priority: formData.priority,
        status: formData.status,
        description: formData.description,
        photos: formData.photos.map((photo) => ({
          id: photo.id,
          name: photo.name,
          size: photo.size,
          preview: photo.preview,
        })),
        createdAt: new Date().toISOString(),
        createdBy: "Current User", // This should come from auth context
        assignedTo: null,
        estimatedHours: null,
        actualHours: null,
        completedAt: null,
        notes: [],
      }

      console.log("📝 Submitting work order:", workOrderData)

      // Dispatch to Redux store
      dispatch(submitWorkOrder(workOrderData))

      // Call parent callback if provided
      if (onSubmit) {
        onSubmit(workOrderData)
      }

      toast.success("Work order created successfully!")

      // Reset form and close dialog
      resetForm()
      onClose()
    } catch (error) {
      console.error("❌ Error submitting work order:", error)
      toast.error("Failed to create work order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      equipmentId: "",
      equipmentName: "",
      stationName: "",
      priority: "",
      status: "Open",
      description: "",
      photos: [],
    })
    setErrors({})
    setEquipmentSearch("")
    setEquipmentResults([])
    setSelectedEquipment(null)
    setSearchError(null)
  }

  // Handle dialog close
  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Create New Work Order
          </DialogTitle>
          <DialogDescription>Fill in the details below to create a new maintenance work order.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Work Order Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Work Order Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Fuel pump maintenance required"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Equipment Search */}
          <div className="space-y-2">
            <Label htmlFor="equipment">
              Equipment <span className="text-red-500">*</span>
            </Label>
            <Popover open={equipmentOpen} onOpenChange={setEquipmentOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={equipmentOpen}
                  className={`w-full justify-between ${errors.equipmentId ? "border-red-500" : ""}`}
                >
                  {selectedEquipment ? (
                    <div className="flex items-center gap-2">
                      {getEquipmentIcon(selectedEquipment.type)}
                      <span>{selectedEquipment.name}</span>
                      <Badge className={getEquipmentBadgeColor(selectedEquipment.type)}>{selectedEquipment.type}</Badge>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Search and select equipment...</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                      className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Search equipment by ID, name, or type..."
                      value={equipmentSearch}
                      onChange={(e) => setEquipmentSearch(e.target.value)}
                    />
                    {isSearching && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                  </div>
                  <CommandList>
                    {searchError && (
                      <div className="p-4">
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{searchError}</AlertDescription>
                        </Alert>
                      </div>
                    )}
                    {equipmentResults.length === 0 && equipmentSearch && !isSearching && !searchError && (
                      <CommandEmpty>No equipment found.</CommandEmpty>
                    )}
                    {equipmentResults.length > 0 && (
                      <CommandGroup>
                        {equipmentResults.map((equipment) => (
                          <CommandItem
                            key={equipment.id}
                            value={equipment.id}
                            onSelect={() => handleEquipmentSelect(equipment)}
                            className="flex items-center gap-3 p-3"
                          >
                            <div className="flex items-center gap-2">
                              {getEquipmentIcon(equipment.type)}
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{equipment.name}</span>
                                  <Badge className={getEquipmentBadgeColor(equipment.type)}>{equipment.type}</Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  ID: {equipment.id} • {equipment.station || equipment.stationName}
                                </div>
                              </div>
                            </div>
                            {selectedEquipment?.id === equipment.id && <Check className="ml-auto h-4 w-4" />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.equipmentId && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.equipmentId}
              </p>
            )}
          </div>

          {/* Station Name (Auto-filled) */}
          {formData.stationName && (
            <div className="space-y-2">
              <Label htmlFor="station">Station</Label>
              <Input id="station" value={formData.stationName} readOnly className="bg-muted" />
            </div>
          )}

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">
              Priority <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
              <SelectTrigger className={errors.priority ? "border-red-500" : ""}>
                <SelectValue placeholder="Select priority level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Low
                  </div>
                </SelectItem>
                <SelectItem value="Medium">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    Medium
                  </div>
                </SelectItem>
                <SelectItem value="High">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    High
                  </div>
                </SelectItem>
                <SelectItem value="Critical">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    Critical
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.priority}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Issue Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Photos (Optional)</Label>
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Camera className="h-5 w-5" />
                  <Upload className="h-5 w-5" />
                </div>
                <div className="text-sm">
                  <span className="font-medium">Click to upload</span> or drag and drop photos
                </div>
                <div className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB each</div>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {/* Photo Previews */}
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {formData.photos.map((photo) => (
                  <Card key={photo.id} className="relative">
                    <CardContent className="p-2">
                      <div className="relative aspect-square">
                        <img
                          src={photo.preview || "/placeholder.svg"}
                          alt={photo.name}
                          className="w-full h-full object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removePhoto(photo.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground truncate">{photo.name}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Create Work Order
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Debounce utility function
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export default WorkOrderForm
