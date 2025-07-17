"use client"

import { useState, useEffect, useCallback } from "react"
import { useDispatch } from "react-redux"
import { X, Upload, Search, Check, Camera, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { submitWorkOrder } from "@/lib/features/workOrders/workOrdersSlice"
import { searchAssets } from "@/lib/api/assets"
import { toast } from "sonner"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

// Equipment type icons mapping
const equipmentIcons = {
  "Fuel Dispenser": "⛽",
  "Storage Tank": "🛢️",
  "Fuel Pump": "🔧",
  Compressor: "🌀",
  "Fire System": "🚨",
  "Car Wash": "🚿",
  ATM: "🏧",
  "POS System": "💳",
  CCTV: "📹",
  Lighting: "💡",
  default: "🔧",
}

// Priority colors
const priorityColors = {
  Low: "bg-green-100 text-green-800 border-green-200",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  High: "bg-orange-100 text-orange-800 border-orange-200",
  Critical: "bg-red-100 text-red-800 border-red-200",
}

export function WorkOrderForm({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showEquipmentSearch, setShowEquipmentSearch] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [photos, setPhotos] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    Equipment_ID: "",
    Station_Name: "",
    issueDescription: "",
    priority: "Medium",
    Requested_By: "",
    Contact_Info: "",
    urgency: "Normal",
    estimatedDuration: "",
    notes: "",
    dueDate: "",
  })

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (!term.trim()) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        const results = await searchAssets(term)
        setSearchResults(results || [])
      } catch (error) {
        console.error("Search error:", error)
        toast.error("Failed to search equipment")
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300),
    [],
  )

  // Effect for search
  useEffect(() => {
    debouncedSearch(searchTerm)
  }, [searchTerm, debouncedSearch])

  // Handle equipment selection
  const handleEquipmentSelect = (equipment) => {
    setSelectedEquipment(equipment)
    setFormData((prev) => ({
      ...prev,
      Equipment_ID: equipment.id,
      Station_Name: equipment.station || "",
    }))
    setShowEquipmentSearch(false)
    setSearchTerm("")
    setErrors((prev) => ({ ...prev, Equipment_ID: "" }))
  }

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  // Handle photo upload
  const handlePhotoUpload = (files) => {
    const newPhotos = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }))

    setPhotos((prev) => [...prev, ...newPhotos])
  }

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files)
    }
  }

  // Remove photo
  const removePhoto = (photoId) => {
    setPhotos((prev) => {
      const updated = prev.filter((photo) => photo.id !== photoId)
      // Clean up object URLs
      const photoToRemove = prev.find((photo) => photo.id === photoId)
      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.url)
      }
      return updated
    })
  }

  // Form validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.Equipment_ID) newErrors.Equipment_ID = "Equipment selection is required"
    if (!formData.Station_Name.trim()) newErrors.Station_Name = "Station name is required"
    if (!formData.issueDescription.trim()) newErrors.issueDescription = "Issue description is required"
    if (!formData.Requested_By.trim()) newErrors.Requested_By = "Requester name is required"
    if (!formData.Contact_Info.trim()) newErrors.Contact_Info = "Contact information is required"
    if (!formData.dueDate) newErrors.dueDate = "Due date is required"

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
      const workOrderData = {
        ...formData,
        Equipment_ID: selectedEquipment?.id || "",
        title: selectedEquipment?.name || "",
        photos: photos.map((photo) => ({
          name: photo.name,
          size: photo.size,
          url: photo.url,
        })),
        status: "Pending",
        createdAt: new Date().toISOString(),
        id: `WO-${Date.now()}`,
      }
      console.log(workOrderData)
      await dispatch(submitWorkOrder(workOrderData)).unwrap()

      toast.success("Work order submitted successfully!")
      handleClose()
    } catch (error) {
      console.error("Submission error:", error)
      toast.error("Failed to submit work order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle dialog close
  const handleClose = () => {
    // Clean up object URLs
    photos.forEach((photo) => {
      URL.revokeObjectURL(photo.url)
    })

    // Reset form
    setFormData({
      Equipment_ID: "",
      Station_Name: "",
      issueDescription: "",
      priority: "Medium",
      Requested_By: "",
      Contact_Info: "",
      urgency: "Normal",
      estimatedDuration: "",
      notes: "",
      dueDate: "",
    })
    setSelectedEquipment(null)
    setPhotos([])
    setSearchTerm("")
    setSearchResults([])
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-blue-600" />
            Create New Work Order
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Equipment Selection */}
          <div className="space-y-2">
            <Label htmlFor="equipment" className="text-sm font-medium">
              Equipment ID *
            </Label>
            <Popover open={showEquipmentSearch} onOpenChange={setShowEquipmentSearch}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={showEquipmentSearch}
                  className={`w-full justify-between ${errors.Equipment_ID ? "border-red-500" : ""}`}
                >
                  {selectedEquipment ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {equipmentIcons[selectedEquipment.type] || equipmentIcons.default}
                      </span>
                      <div className="text-left">
                        <div className="font-medium">{selectedEquipment.id}</div>
                        <div className="text-xs text-muted-foreground">{selectedEquipment.name}</div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Search and select equipment...</span>
                  )}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search equipment by ID, name, or type..."
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                  />
                  <CommandList>
                    {isSearching ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
                    ) : searchResults.length === 0 && searchTerm ? (
                      <CommandEmpty>No equipment found.</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {searchResults.map((equipment) => (
                          <CommandItem
                            key={equipment.id}
                            value={equipment.id}
                            onSelect={() => handleEquipmentSelect(equipment)}
                            className="flex items-center gap-3 p-3"
                          >
                            <span className="text-lg">{equipmentIcons[equipment.type] || equipmentIcons.default}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{equipment.id}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {equipment.type}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">{equipment.name}</div>
                              <div className="text-xs text-muted-foreground">{equipment.station}</div>
                            </div>
                            {selectedEquipment?.id === equipment.id && <Check className="h-4 w-4 text-blue-600" />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.Equipment_ID && <p className="text-sm text-red-600">{errors.Equipment_ID}</p>}
          </div>

          {/* Station Name */}
          <div className="space-y-2">
            <Label htmlFor="Station_Name" className="text-sm font-medium">
              Station Name *
            </Label>
            <Input
              id="Station_Name"
              value={formData.Station_Name}
              onChange={(e) => handleInputChange("Station_Name", e.target.value)}
              placeholder="Enter station name"
              className={errors.Station_Name ? "border-red-500" : ""}
            />
            {errors.Station_Name && <p className="text-sm text-red-600">{errors.Station_Name}</p>}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-medium">
              Priority
            </Label>
            <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
              <SelectTrigger>
                <SelectValue />
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
          </div>

          {/* Issue Description */}
          <div className="space-y-2">
            <Label htmlFor="issueDescription" className="text-sm font-medium">
              Issue Description *
            </Label>
            <Textarea
              id="issueDescription"
              value={formData.issueDescription}
              onChange={(e) => handleInputChange("issueDescription", e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={4}
              className={errors.issueDescription ? "border-red-500" : ""}
            />
            {errors.issueDescription && <p className="text-sm text-red-600">{errors.issueDescription}</p>}
          </div>

          {/* Requester Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="Requested_By" className="text-sm font-medium">
                Requested By *
              </Label>
              <Input
                id="Requested_By"
                value={formData.Requested_By}
                onChange={(e) => handleInputChange("Requested_By", e.target.value)}
                placeholder="Your name"
                className={errors.Requested_By ? "border-red-500" : ""}
              />
              {errors.Requested_By && <p className="text-sm text-red-600">{errors.Requested_By}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="Contact_Info" className="text-sm font-medium">
                Contact Info *
              </Label>
              <Input
                id="Contact_Info"
                value={formData.Contact_Info}
                onChange={(e) => handleInputChange("Contact_Info", e.target.value)}
                placeholder="Phone or email"
                className={errors.Contact_Info ? "border-red-500" : ""}
              />
              {errors.Contact_Info && <p className="text-sm text-red-600">{errors.Contact_Info}</p>}
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-sm font-medium">
              Due Date *
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
              className={errors.dueDate ? "border-red-500" : ""}
            />
            {errors.dueDate && <p className="text-sm text-red-600">{errors.dueDate}</p>}
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Photos (Optional)</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">Drag and drop photos here, or click to select</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e.target.files)}
                className="hidden"
                id="photo-upload"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("photo-upload").click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            </div>

            {/* Photo Previews */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {photos.map((photo) => (
                  <Card key={photo.id} className="relative">
                    <CardContent className="p-2">
                      <img
                        src={photo.url || "/placeholder.svg"}
                        alt={photo.name}
                        className="w-full h-20 object-cover rounded"
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
                      <p className="text-xs text-gray-500 mt-1 truncate">{photo.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any additional information..."
              rows={3}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
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
