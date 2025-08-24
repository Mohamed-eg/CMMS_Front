"use client"

import { useState, useCallback, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, FileImage, AlertCircle, CheckCircle2, Building, Search, User, Package, Check } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { searchAssets } from "@/lib/api/assets"
import { searchUsers } from "@/lib/api/users"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function AddStationForm({ isOpen, onClose, onSubmit }) {
  const dispatch = useDispatch()
  const [dragActive, setDragActive] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    licenseNumber: "",
    type: "",
    location: "",
    address: "",
    city: "",
    region: "",
    postalCode: "",
    gpsCoordinates: "",
    totalArea: "",
    phone: "",
    email: "",
    managerName: "",
    managerEmail: "", // Add manager email field
    capacity: "",
    fuelTypes: [],
    services: [],
    operatingHours: "",
    fuelBrands: [],
    establishedDate: "",
    emergencyContact: "",
    notes: "",
    assetIds: [],
    managerUserId: "",
    technicianUserIds: [],
    photos: [],
    documents: []
  })

  const [errors, setErrors] = useState({})

  // Search state
  const [assetQuery, setAssetQuery] = useState("")
  const [assetResults, setAssetResults] = useState([])
  const [assetsLoading, setAssetsLoading] = useState(false)
  const [selectedAssets, setSelectedAssets] = useState([]) // [{id,name,category}]
  
  // User search states
  const [managerQuery, setManagerQuery] = useState("")
  const [managerResults, setManagerResults] = useState([])
  const [managersLoading, setManagersLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null) // {id, name, email}
  
  const [technicianQuery, setTechnicianQuery] = useState("")
  const [technicianResults, setTechnicianResults] = useState([])
  const [techniciansLoading, setTechniciansLoading] = useState(false)
  const [selectedTechnicians, setSelectedTechnicians] = useState([])

  // Manager search states for Station Manager Name
  const [stationManagerQuery, setStationManagerQuery] = useState("")
  const [stationManagerResults, setStationManagerResults] = useState([])
  const [showStationManagerSearch, setShowStationManagerSearch] = useState(false)
  const [selectedStationManager, setSelectedStationManager] = useState(null)

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

  // Fetch managers when form opens
  const fetchManagers = useCallback(async () => {
    try {
      const response = await fetch('https://cmms-back.vercel.app/api/users/managers')
      if (!response.ok) {
        throw new Error('Failed to fetch managers')
      }
      const data = await response.json()
      const managers = data.managers || []
      
      // Store managers in localStorage
      localStorage.setItem('stationManagers', JSON.stringify(managers))
      
      console.log('Managers fetched and stored:', managers)
    } catch (error) {
      console.error('Error fetching managers:', error)
      toast.error('Failed to fetch managers list')
    }
  }, [])

  // Load managers from localStorage
  const loadManagersFromStorage = useCallback(() => {
    try {
      const storedManagers = localStorage.getItem('stationManagers')
      if (storedManagers) {
        return JSON.parse(storedManagers)
      }
    } catch (error) {
      console.error('Error loading managers from storage:', error)
    }
    return []
  }, [])

  // Search managers in localStorage
  const searchStationManagers = useCallback((query) => {
    if (!query.trim()) {
      setStationManagerResults([])
      return
    }

    const managers = loadManagersFromStorage()
    console.log(managers)
    const filteredManagers = managers.filter(manager => {
      const fullName = `${manager.firstName || ''} ${manager.lastName || ''}`.toLowerCase()
      const email = (manager.email || '').toLowerCase()
      const queryLower = query.toLowerCase()
      
      return fullName.includes(queryLower) || email.includes(queryLower)
    })
    console.log(filteredManagers)
    setStationManagerResults(filteredManagers)
  }, [loadManagersFromStorage])

  // Handle station manager selection
  const handleStationManagerSelect = (manager) => {
    const fullName = `${manager.firstName || ''} ${manager.lastName || ''}`.trim()
    setSelectedStationManager(manager)
    setFormData(prev => ({
      ...prev,
      managerName: fullName,
      managerEmail: manager.email || ''
    }))
    setShowStationManagerSearch(false)
    setStationManagerQuery("")
    setErrors(prev => ({ ...prev, managerName: "" }))
  }

  // Clear selected station manager
  const clearStationManager = () => {
    setSelectedStationManager(null)
    setFormData(prev => ({
      ...prev,
      managerName: "",
      managerEmail: ""
    }))
  }

  // Fetch managers when form opens
  useEffect(() => {
    if (isOpen) {
      fetchManagers()
    }
  }, [isOpen, fetchManagers])

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
    const namePart = name.replace(/\s+/g, "").substring(0, 3).toUpperCase()
    const cityPart = city.replace(/\s+/g, "").substring(0, 3).toUpperCase()
    const timestamp = Date.now().toString().slice(-4)
    return `${namePart}-${cityPart}-${timestamp}`
  }

  // Handle station name change and auto-generate code
  const handleStationNameChange = (value) => {
    handleInputChange("name", value)
    if (value && formData.city && !formData.code) {
      handleInputChange("code", generateStationCode(value, formData.city))
    }
  }

  // Handle city change and update station code
  const handleCityChange = (value) => {
    handleInputChange("city", value)
    if (formData.name && value) {
      handleInputChange("code", generateStationCode(formData.name, value))
    }
  }

  // Handle fuel brands selection
  const handleFuelBrandToggle = (brand) => {
    const currentBrands = formData.fuelBrands || []
    const updatedBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand]
    handleInputChange("fuelBrands", updatedBrands)
  }

  // Asset search
  const handleAssetSearch = useCallback(async (term) => {
    setAssetQuery(term)
    setAssetsLoading(true)
    try {
      const res = await searchAssets(term)
      const items = Array.isArray(res) ? res : res.assets || res || []
      setAssetResults(items)
    } catch (e) {
      setAssetResults([])
    } finally {
      setAssetsLoading(false)
    }
  }, [])

  const addAssetSelection = (asset) => {
    if (!asset) return
    const id = asset.id || asset._id || asset.assetCode
    if (!id) return
    if (selectedAssets.some((a) => (a.id || a._id) === id)) return
    setSelectedAssets((prev) => [...prev, { id, name: asset.name || asset.title || id, category: asset.category || asset.type }])
    handleInputChange("assetIds", [...formData.assetIds, id])
  }

  const removeAssetSelection = (id) => {
    setSelectedAssets((prev) => prev.filter((a) => (a.id || a._id) !== id))
    handleInputChange("assetIds", formData.assetIds.filter((x) => x !== id))
  }

  // User search
  const handleManagerSearch = useCallback(async (query) => {
    if (query.trim().length < 2) {
      setManagerResults([])
      return
    }

    setManagersLoading(true)
    try {
      const results = await searchUsers(query)
      setManagerResults(results)
    } catch (error) {
      console.error("Error searching users:", error)
      toast({
        title: "Error",
        description: "Failed to search users",
        variant: "destructive"
      })
    } finally {
      setManagersLoading(false)
    }
  }, [])

  const handleTechnicianSearch = useCallback(async (query) => {
    if (query.trim().length < 2) {
      setTechnicianResults([])
      return
    }

    setTechniciansLoading(true)
    try {
      const results = await searchUsers(query)
      setTechnicianResults(results)
    } catch (error) {
      console.error("Error searching users:", error)
      toast({
        title: "Error",
        description: "Failed to search users",
        variant: "destructive"
      })
    } finally {
      setTechniciansLoading(false)
    }
  }, [])

  const selectUser = (user) => {
    if (!user) return
    const id = user.id || user._id
    const fullName = user.name || [user.FirstName, user.LastName].filter(Boolean).join(" ") || user.email || id
    setSelectedUser({ id, name: fullName, email: user.Email || user.email })
    handleInputChange("managerUserId", id)
    setManagerQuery("")
    setManagerResults([])
  }

  const selectTechnician = (user) => {
    if (!user) return
    const id = user.id || user._id
    const fullName = user.name || [user.FirstName, user.LastName].filter(Boolean).join(" ") || user.email || id
    if (!selectedTechnicians.find(t => t.id === id)) {
      setSelectedTechnicians(prev => [...prev, { id, name: fullName, email: user.Email || user.email }])
    }
    setTechnicianQuery("")
    setTechnicianResults([])
  }

  const removeTechnician = (technicianId) => {
    setSelectedTechnicians(prev => prev.filter(t => t.id !== technicianId))
  }

  const clearManager = () => {
    setSelectedUser(null)
    handleInputChange("managerUserId", "")
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
    if (e.type === "dragenter" || e.type === "dragleave" || e.type === "dragover") {
      setDragActive(e.type !== "dragleave")
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
    if (!formData.name.trim()) newErrors.name = "Station name is required"
    if (!formData.code.trim()) newErrors.code = "Station code is required"
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "License number is required"
    if (!formData.type) newErrors.type = "Station type is required"

    // Location Information
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.region) newErrors.region = "Region is required"

    // Contact Information
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.managerName.trim()) newErrors.managerName = "Manager name is required"
    if (!formData.managerEmail.trim()) newErrors.managerEmail = "Manager email is required"

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
        assetIds: selectedAssets.map((a) => a.id),
        managerUserId: selectedUser?.id || formData.managerUserId,
        technicianUserIds: selectedTechnicians.map(t => t.id),
        managerEmail: selectedStationManager?.email || formData.managerEmail // Send manager email
      }

      // Submit via parent or leave to caller
      if (onSubmit) {
        await onSubmit(stationData)
      }

      toast.success("Station added successfully!")

      // Reset form
      setFormData({
        name: "",
        code: "",
        licenseNumber: "",
        type: "",
        location: "",
        address: "",
        city: "",
        region: "",
        postalCode: "",
        gpsCoordinates: "",
        totalArea: "",
        phone: "",
        email: "",
        managerName: "",
        managerEmail: "",
        capacity: "",
        fuelTypes: [],
        services: [],
        operatingHours: "",
        fuelBrands: [],
        establishedDate: "",
        emergencyContact: "",
        notes: "",
        assetIds: [],
        managerUserId: "",
        technicianUserIds: [],
        photos: [],
        documents: [],
      })
      setSelectedAssets([])
      setSelectedUser(null)
      setSelectedTechnicians([])
      setSelectedStationManager(null)
      setErrors({})
      setAssetQuery("")
      setManagerQuery("")
      setTechnicianQuery("")
      setStationManagerQuery("")
      setAssetResults([])
      setManagerResults([])
      setTechnicianResults([])
      setStationManagerResults([])

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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Station Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter station name"
                    value={formData.name}
                    onChange={(e) => handleStationNameChange(e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Station Code *</Label>
                  <Input
                    id="code"
                    placeholder="Auto-generated station code"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    className={errors.code ? "border-red-500" : ""}
                  />
                  {errors.code && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.code}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number *</Label>
                  <Input
                    id="licenseNumber"
                    placeholder="Enter license number"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                    className={errors.licenseNumber ? "border-red-500" : ""}
                  />
                  {errors.licenseNumber && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.licenseNumber}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Station Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger className={errors.type ? "border-red-500" : ""}>
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
                  {errors.type && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.type}
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
                <Popover open={showStationManagerSearch} onOpenChange={setShowStationManagerSearch}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={showStationManagerSearch}
                      className={`w-full justify-between ${errors.managerName ? "border-red-500" : ""}`}
                    >
                      {selectedStationManager ? (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-600" />
                          <div className="text-left">
                            <div className="font-medium">{selectedStationManager.firstName} {selectedStationManager.lastName}</div>
                            <div className="text-xs text-muted-foreground">{selectedStationManager.email}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Search and select manager...</span>
                      )}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search managers by name or email..."
                        value={stationManagerQuery}
                        onValueChange={(value) => {
                          setStationManagerQuery(value)
                          searchStationManagers(value)
                        }}
                      />
                      <CommandList>
                        {stationManagerResults.length === 0 && !stationManagerQuery ? (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            Start typing to search managers...
                          </div>
                        ) : stationManagerResults.length === 0 && stationManagerQuery ? (
                          <CommandEmpty>No managers found.</CommandEmpty>
                        ) : (
                          <CommandGroup>
                            {stationManagerResults.map((manager) => (
                              <CommandItem
                                key={manager._id || manager.id}
                                value={manager._id || manager.id}
                                onSelect={() => handleStationManagerSelect(manager)}
                                className="flex items-center gap-3 p-3"
                              >
                                <User className="h-4 w-4 text-blue-600" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{manager.firstName} {manager.lastName}</span>
                                    <Badge variant="secondary" className="text-xs">
                                      {manager.role || "Manager"}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground">{manager.email}</div>
                                  <div className="text-xs text-muted-foreground">{manager.station_Name || "No station assigned"}</div>
                                </div>
                                {selectedStationManager?._id === (manager._id || manager.id) && <Check className="h-4 w-4 text-blue-600" />}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedStationManager && (
                  <p className="text-xs text-blue-600 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Manager selected: {selectedStationManager.firstName} {selectedStationManager.lastName} ({selectedStationManager.email})
                  </p>
                )}
                {errors.managerName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.managerName}
                  </p>
                )}
                {errors.managerEmail && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.managerEmail}
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Assignments Tab */}
            <TabsContent value="assignments" className="space-y-6">
              {/* Assign Assets */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Assign Assets</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Search and select assets to assign to this station
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Input
                    placeholder="Search assets..."
                    value={assetQuery}
                    onChange={(e) => setAssetQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAssetSearch(assetQuery)
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAssetSearch(assetQuery)}
                    disabled={assetsLoading}
                  >
                    {assetsLoading ? "Searching..." : "Search"}
                  </Button>
                </div>

                {assetResults.length > 0 && (
                  <Command className="border rounded-lg">
                    <CommandList>
                      {assetResults.map((asset) => (
                        <CommandItem
                          key={asset.id}
                          onSelect={() => addAssetSelection(asset)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{asset.name}</span>
                            <span className="text-sm text-muted-foreground">({asset.category})</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                )}

                {selectedAssets.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Selected Assets:</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedAssets.map((asset) => (
                        <Badge key={asset.id} variant="secondary" className="flex items-center gap-1">
                          {asset.name}
                          <button
                            type="button"
                            onClick={() => removeAssetSelection(asset.id)}
                            className="ml-1 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Assign Manager */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Assign Manager</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Search and select one manager for this station
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Input
                    placeholder="Search users for manager..."
                    value={managerQuery}
                    onChange={(e) => setManagerQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleManagerSearch(managerQuery)
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleManagerSearch(managerQuery)}
                    disabled={managersLoading}
                  >
                    {managersLoading ? "Searching..." : "Search"}
                  </Button>
                </div>

                {managerResults.length > 0 && (
                  <Command className="border rounded-lg">
                    <CommandList>
                      {managerResults.map((user) => (
                        <CommandItem
                          key={user.id || user._id}
                          onSelect={() => selectUser(user)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{user.name || [user.FirstName, user.LastName].filter(Boolean).join(" ") || user.email}</span>
                            <span className="text-sm text-muted-foreground">({user.role || user.Role || "User"})</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                )}

                {selectedUser && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Selected Manager:</Label>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {selectedUser.name} (Manager)
                      <button
                        type="button"
                        onClick={clearManager}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  </div>
                )}
              </div>

              {/* Assign Technicians */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Assign Technicians</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Search and select unlimited technicians for this station
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Input
                    placeholder="Search users for technicians..."
                    value={technicianQuery}
                    onChange={(e) => setTechnicianQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleTechnicianSearch(technicianQuery)
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleTechnicianSearch(technicianQuery)}
                    disabled={techniciansLoading}
                  >
                    {techniciansLoading ? "Searching..." : "Search"}
                  </Button>
                </div>

                {technicianResults.length > 0 && (
                  <Command className="border rounded-lg">
                    <CommandList>
                      {technicianResults.map((user) => (
                        <CommandItem
                          key={user.id || user._id}
                          onSelect={() => selectTechnician(user)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{user.name || [user.FirstName, user.LastName].filter(Boolean).join(" ") || user.email}</span>
                            <span className="text-sm text-muted-foreground">({user.role || user.Role || "User"})</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                )}

                {selectedTechnicians.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Selected Technicians:</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedTechnicians.map((technician) => (
                        <Badge key={technician.id} variant="secondary" className="flex items-center gap-1">
                          {technician.name} (Technician)
                          <button
                            type="button"
                            onClick={() => removeTechnician(technician.id)}
                            className="ml-1 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
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
