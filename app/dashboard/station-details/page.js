"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Upload, Eye, Edit, Zap, Droplets, AlertTriangle, Loader2, RefreshCw, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImageIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  fetchStations,
  fetchStationDetails,
  setSelectedStation,
  clearErrors,
} from "@/lib/features/stations/stationsSlice"
import { toast } from "sonner"
import AddStationForm from "@/components/add-station-form"

export default function StationDetailsPage() {
  const dispatch = useDispatch()
  const { stations, selectedStation, stationDetails, loading, error } = useSelector((state) => state.stations)

  const [selectedImage, setSelectedImage] = useState(null)
  const [showDefaultStation, setShowDefaultStation] = useState(false)
  const [showAddStationForm, setShowAddStationForm] = useState(false)

  // Default station data (Version 2) - Enhanced with more comprehensive data
  const defaultStationData = {
    stationInfo: {
      name: "Al-Noor Gas Station (Default View)",
      location: "Prince Mohammed Bin Abdulaziz Road, Riyadh, Saudi Arabia",
      gpsCoordinates: "24.7136° N, 46.6753° E",
      contactInfo: {
        phone: "+966 11 456 7890",
        email: "info@alnoor-gas.sa",
        manager: "Omar Al-Noor",
      },
      operatingHours: "24/7",
      stationCode: "GS-RYD-002",
      licenseNumber: "GS-2024-002",
      establishedDate: "2020-05-15",
      totalArea: "2,500 sqm",
      fuelBrands: ["Saudi Aramco", "ADNOC"],
    },
    equipment: [
      {
        category: "Fuel Dispensers",
        items: [
          {
            id: "DISP-001",
            name: "Gilbarco Encore 700 S - Island A1",
            model: "Gilbarco Encore 700 S",
            serialNumber: "GE-2024-001",
            installDate: "2024-01-20",
            status: "Active",
            fuelTypes: ["Gasoline 91", "Gasoline 95"],
            nozzles: 2,
            hoses: 2,
            lastMaintenance: "2024-01-15",
            nextMaintenance: "2024-04-15",
          },
          {
            id: "DISP-002",
            name: "Gilbarco Encore 700 S - Island A2",
            model: "Gilbarco Encore 700 S",
            serialNumber: "GE-2024-002",
            installDate: "2024-01-20",
            status: "Active",
            fuelTypes: ["Gasoline 91", "Diesel"],
            nozzles: 2,
            hoses: 2,
            lastMaintenance: "2024-01-10",
            nextMaintenance: "2024-04-10",
          },
          {
            id: "DISP-003",
            name: "Wayne Helix 6000 - Island B1",
            model: "Wayne Helix 6000",
            serialNumber: "WH-2024-001",
            installDate: "2024-02-01",
            status: "Active",
            fuelTypes: ["Gasoline 95", "Premium"],
            nozzles: 2,
            hoses: 2,
            lastMaintenance: "2024-01-20",
            nextMaintenance: "2024-04-20",
          },
        ],
      },
      {
        category: "Storage Tanks",
        items: [
          {
            id: "TANK-001",
            name: "Underground Tank #1 - Gasoline 91",
            capacity: "60,000 L",
            fuelType: "Gasoline 91",
            installDate: "2020-05-15",
            status: "Active",
            lastInspection: "2024-01-15",
            nextInspection: "2024-07-15",
            material: "Double-wall Fiberglass",
            currentLevel: "85%",
          },
          {
            id: "TANK-002",
            name: "Underground Tank #2 - Gasoline 95",
            capacity: "60,000 L",
            fuelType: "Gasoline 95",
            installDate: "2020-05-15",
            status: "Active",
            lastInspection: "2024-01-15",
            nextInspection: "2024-07-15",
            material: "Double-wall Fiberglass",
            currentLevel: "72%",
          },
          {
            id: "TANK-003",
            name: "Underground Tank #3 - Diesel",
            capacity: "40,000 L",
            fuelType: "Diesel",
            installDate: "2020-05-15",
            status: "Active",
            lastInspection: "2024-01-15",
            nextInspection: "2024-07-15",
            material: "Double-wall Fiberglass",
            currentLevel: "68%",
          },
        ],
      },
      {
        category: "Auxiliary Equipment",
        items: [
          {
            id: "COMP-001",
            name: "Air Compressor Unit",
            model: "Atlas Copco GA15",
            serialNumber: "AC-2020-001",
            installDate: "2020-06-01",
            status: "Active",
            specifications: "15 kW, 2.4 m³/min",
            lastMaintenance: "2024-01-05",
            nextMaintenance: "2024-04-05",
          },
          {
            id: "WASH-001",
            name: "Car Wash System",
            model: "WashTec SoftCare Pro",
            serialNumber: "WS-2021-001",
            installDate: "2021-03-10",
            status: "Active",
            specifications: "Automatic touchless system",
            lastMaintenance: "2024-01-12",
            nextMaintenance: "2024-04-12",
          },
        ],
      },
    ],
    utilities: [
      {
        type: "Electrical",
        description: "Main electrical distribution system",
        location: "Electrical room - East side",
        specifications: "630 kVA transformer, 400V 3-phase distribution",
        lastInspection: "2024-01-10",
        nextInspection: "2024-07-10",
        status: "Excellent",
        emergencyShutoff: "Main breaker in electrical room",
        contractor: "Saudi Electric Company",
      },
      {
        type: "Water",
        description: "Municipal water supply and distribution",
        location: "Utility room - North side",
        specifications: "4-inch main line, 45 PSI, backflow prevention",
        lastInspection: "2024-01-08",
        nextInspection: "2024-07-08",
        status: "Good",
        emergencyShutoff: "Main valve near street connection",
        contractor: "National Water Company",
      },
      {
        type: "Emergency Systems",
        description: "Emergency power and safety systems",
        location: "Multiple strategic locations",
        specifications: "200 kW backup generator, UPS systems, emergency lighting",
        lastInspection: "2024-01-12",
        nextInspection: "2024-04-12",
        status: "Excellent",
        emergencyShutoff: "Emergency stop buttons at 6 locations",
        contractor: "Emergency Systems KSA",
      },
      {
        type: "HVAC",
        description: "Heating, ventilation, and air conditioning",
        location: "Store and office areas",
        specifications: "Central AC system, 50 TR capacity",
        lastInspection: "2024-01-05",
        nextInspection: "2024-04-05",
        status: "Good",
        emergencyShutoff: "HVAC control panel",
        contractor: "Climate Control Solutions",
      },
    ],
    safety: [
      {
        type: "Fire Extinguishers",
        quantity: 15,
        locations: [
          "Pump islands (6)",
          "Convenience store (3)",
          "Utility room (2)",
          "Office areas (2)",
          "Storage room (1)",
          "Car wash area (1)",
        ],
        lastInspection: "2024-01-20",
        nextInspection: "2024-04-20",
        status: "All functional and certified",
        specifications: "ABC dry chemical, 9kg capacity",
        contractor: "Fire Safety KSA",
      },
      {
        type: "Spill Kits",
        quantity: 8,
        locations: ["Each pump island (6)", "Storage area (1)", "Utility room (1)"],
        lastInspection: "2024-01-18",
        nextInspection: "2024-04-18",
        status: "Fully stocked and ready",
        specifications: "50L absorbent capacity per kit",
        contractor: "Environmental Safety Co.",
      },
      {
        type: "Emergency Exits",
        quantity: 10,
        locations: [
          "Store main entrance/exit (2)",
          "Store emergency exits (2)",
          "Office emergency exits (2)",
          "Pump area emergency routes (4)",
        ],
        lastInspection: "2024-01-15",
        nextInspection: "2024-04-15",
        status: "Clear, marked, and illuminated",
        specifications: "LED emergency lighting, 3-hour battery backup",
        contractor: "Safety Systems KSA",
      },
      {
        type: "Emergency Shutoffs",
        quantity: 8,
        locations: [
          "Main electrical shutoff",
          "Fuel pump emergency stops (4)",
          "Gas line shutoff",
          "Water main shutoff",
          "Master emergency stop",
        ],
        lastInspection: "2024-01-12",
        nextInspection: "2024-04-12",
        status: "All operational and tested",
        specifications: "Mushroom-head emergency stops, clearly marked",
        contractor: "Emergency Systems KSA",
      },
      {
        type: "Fire Suppression System",
        quantity: 1,
        locations: ["Canopy area - overhead suppression"],
        lastInspection: "2024-01-10",
        nextInspection: "2024-07-10",
        status: "System operational and tested",
        specifications: "Foam-based suppression system",
        contractor: "Fire Protection Systems",
      },
    ],
    photos: [
      {
        id: 1,
        title: "Aerial View - Complete Station Layout",
        description: "Comprehensive overhead view showing all station areas and traffic flow",
        category: "Site Overview",
        url: "/placeholder.svg?height=400&width=600",
        dateTaken: "2024-01-20",
        photographer: "Station Documentation Team",
      },
      {
        id: 2,
        title: "Pump Islands - Customer Service Area",
        description: "Modern fuel dispensers with LED canopy lighting",
        category: "Pump Area",
        url: "/placeholder.svg?height=400&width=600",
        dateTaken: "2024-01-20",
        photographer: "Station Documentation Team",
      },
      {
        id: 3,
        title: "Convenience Store - Customer Entrance",
        description: "Modern store front with automatic doors and LED signage",
        category: "Store",
        url: "/placeholder.svg?height=400&width=600",
        dateTaken: "2024-01-20",
        photographer: "Station Documentation Team",
      },
      {
        id: 4,
        title: "Utility Equipment Room",
        description: "Electrical panels, water systems, and emergency equipment",
        category: "Utilities",
        url: "/placeholder.svg?height=400&width=600",
        dateTaken: "2024-01-20",
        photographer: "Station Documentation Team",
      },
      {
        id: 5,
        title: "Car Wash Facility",
        description: "Automated touchless car wash system",
        category: "Services",
        url: "/placeholder.svg?height=400&width=600",
        dateTaken: "2024-01-20",
        photographer: "Station Documentation Team",
      },
      {
        id: 6,
        title: "Safety Equipment Locations",
        description: "Fire extinguishers and emergency equipment placement",
        category: "Safety",
        url: "/placeholder.svg?height=400&width=600",
        dateTaken: "2024-01-20",
        photographer: "Station Documentation Team",
      },
    ],
    layoutAreas: [
      {
        id: "pump-islands",
        name: "Fuel Dispensing Area",
        description: "6 pump islands with 12 dispensers total",
        coordinates: "Central area under main canopy",
        equipment: ["12 Fuel Dispensers", "LED Canopy Lighting", "Emergency Stop Systems", "CCTV Cameras"],
        photos: ["/placeholder.svg?height=200&width=300"],
        area: "800 sqm",
        capacity: "24 vehicles simultaneously",
      },
      {
        id: "storage-tanks",
        name: "Underground Storage System",
        description: "3 double-wall underground fuel storage tanks",
        coordinates: "North side underground - 3m depth",
        equipment: [
          "Tank #1 (Gasoline 91 - 60,000L)",
          "Tank #2 (Gasoline 95 - 60,000L)",
          "Tank #3 (Diesel - 40,000L)",
          "Leak Detection System",
          "Tank Monitoring System",
        ],
        photos: ["/placeholder.svg?height=200&width=300"],
        area: "200 sqm surface area",
        capacity: "160,000L total storage",
      },
      {
        id: "convenience-store",
        name: "Retail & Service Center",
        description: "Modern convenience store with customer services",
        coordinates: "East side main building",
        equipment: [
          "POS Systems (4 stations)",
          "Refrigeration Units (6)",
          "HVAC System",
          "Security System",
          "ATM Machine",
          "Coffee Station",
        ],
        photos: ["/placeholder.svg?height=200&width=300"],
        area: "300 sqm",
        capacity: "50 customers",
      },
      {
        id: "car-wash",
        name: "Automated Car Wash",
        description: "Touchless car wash facility",
        coordinates: "West side of property",
        equipment: ["WashTec SoftCare Pro", "Water Recycling System", "Drying System", "Payment Kiosk"],
        photos: ["/placeholder.svg?height=200&width=300"],
        area: "150 sqm",
        capacity: "1 vehicle at a time",
      },
      {
        id: "utility-area",
        name: "Technical & Utility Systems",
        description: "Equipment room and utility connections",
        coordinates: "North side utility building",
        equipment: [
          "Main Electrical Panel",
          "Water Distribution System",
          "Air Compressor",
          "Backup Generator",
          "Fire Suppression Controls",
        ],
        photos: ["/placeholder.svg?height=200&width=300"],
        area: "100 sqm",
        capacity: "Equipment only",
      },
    ],
  }

  // Load stations on component mount
  useEffect(() => {
    dispatch(fetchStations())
  }, [dispatch])

  // Handle API fetch failures - show default station
  useEffect(() => {
    if (error.stations && !showDefaultStation) {
      setShowDefaultStation(true)
      toast.error("Unable to load stations from server. Showing default station view.")
    }
  }, [error.stations, showDefaultStation])

  // Load station details when a station is selected
  useEffect(() => {
    if (selectedStation && !showDefaultStation) {
      dispatch(fetchStationDetails(selectedStation.id))
    }
  }, [selectedStation, dispatch, showDefaultStation])

  // Handle station selection
  const handleStationSelect = (stationId) => {
    if (stationId === "default") {
      setShowDefaultStation(true)
      return
    }

    const station = stations.find((s) => s.id === stationId)
    if (station) {
      setShowDefaultStation(false)
      dispatch(setSelectedStation(station))
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    setShowDefaultStation(false)
    if (selectedStation) {
      dispatch(fetchStationDetails(selectedStation.id))
    }
    dispatch(fetchStations())
  }

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearErrors())
    }
  }, [dispatch])

  // Show error toast for details only (not for stations since we handle that with default view)
  useEffect(() => {
    if (error.details) {
      toast.error(error.details)
    }
  }, [error.details])

  // Determine which data to use
  const currentStationInfo = showDefaultStation
    ? defaultStationData.stationInfo
    : stationDetails.stationInfo || defaultStationData.stationInfo

  const currentEquipment = showDefaultStation
    ? defaultStationData.equipment
    : stationDetails.equipment || defaultStationData.equipment

  const currentUtilities = showDefaultStation
    ? defaultStationData.utilities
    : stationDetails.utilities || defaultStationData.utilities

  const currentSafety = showDefaultStation
    ? defaultStationData.safety
    : stationDetails.safety || defaultStationData.safety

  const currentPhotos = showDefaultStation
    ? defaultStationData.photos
    : stationDetails.photos || defaultStationData.photos

  const currentLayoutAreas = showDefaultStation
    ? defaultStationData.layoutAreas
    : stationDetails.layoutAreas || defaultStationData.layoutAreas

  return (
    <div className="space-y-6">
      {/* Header with Station Selector */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Station Details</h1>
          <p className="text-muted-foreground">Comprehensive information about your gas station</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Station Selector */}
          <div className="min-w-[300px]">
            <Label htmlFor="station-select" className="text-sm font-medium">
              Select Station
            </Label>
            <Select
              value={showDefaultStation ? "default" : selectedStation?.id || ""}
              onValueChange={handleStationSelect}
              disabled={loading.stations}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={loading.stations ? "Loading stations..." : "Choose a station"} />
              </SelectTrigger>
              <SelectContent>
                {/* Default station option */}
                <SelectItem value="default">
                  <div className="flex flex-col">
                    <span className="font-medium">Al-Noor Gas Station (Default)</span>
                    <span className="text-xs text-muted-foreground">Demo station with sample data</span>
                  </div>
                </SelectItem>

                {/* API stations */}
                {stations.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{station.name}</span>
                      <span className="text-xs text-muted-foreground">{station.location}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading.stations || loading.details}>
              {loading.stations || loading.details ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>

            <Button onClick={() => setShowAddStationForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Station
            </Button>

            <Button disabled={!selectedStation && !showDefaultStation}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Documents
            </Button>
          </div>
        </div>
      </div>

      {/* Status Alert */}
      {showDefaultStation && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Showing default station data. API connection failed or no stations available.
            {error.stations && ` Error: ${error.stations}`}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert for details */}
      {error.details && !showDefaultStation && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error.details}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading.details && selectedStation && !showDefaultStation && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading station details...</span>
          </div>
        </div>
      )}

      {/* Station Details Content */}
      {(selectedStation || showDefaultStation) && !loading.details && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="utilities">Utilities</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          {/* Station Overview */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Station Information
                    {showDefaultStation && (
                      <Badge variant="outline" className="ml-2">
                        Default View
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Station Name</Label>
                    <p className="text-sm">{currentStationInfo.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="text-sm">{currentStationInfo.location}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">GPS Coordinates</Label>
                    <p className="text-sm font-mono">{currentStationInfo.gpsCoordinates}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Station Code</Label>
                    <p className="text-sm">{currentStationInfo.stationCode}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">License Number</Label>
                    <p className="text-sm">{currentStationInfo.licenseNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Operating Hours</Label>
                    <p className="text-sm">{currentStationInfo.operatingHours}</p>
                  </div>
                  {currentStationInfo.establishedDate && (
                    <div>
                      <Label className="text-sm font-medium">Established</Label>
                      <p className="text-sm">{currentStationInfo.establishedDate}</p>
                    </div>
                  )}
                  {currentStationInfo.totalArea && (
                    <div>
                      <Label className="text-sm font-medium">Total Area</Label>
                      <p className="text-sm">{currentStationInfo.totalArea}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm">{currentStationInfo.contactInfo.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm">{currentStationInfo.contactInfo.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Station Manager</Label>
                    <p className="text-sm">{currentStationInfo.contactInfo.manager}</p>
                  </div>
                  {currentStationInfo.fuelBrands && (
                    <div>
                      <Label className="text-sm font-medium">Fuel Brands</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {currentStationInfo.fuelBrands.map((brand, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {brand}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Fuel Dispensers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentEquipment.filter((cat) => cat.category === "Fuel Dispensers")[0]?.items?.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Active dispensers</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Storage Tanks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentEquipment.filter((cat) => cat.category === "Storage Tanks")[0]?.items?.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Underground tanks</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Safety Equipment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentSafety.reduce((total, item) => total + (item.quantity || 0), 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Safety items</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentPhotos.length}</div>
                  <p className="text-xs text-muted-foreground">Station photos</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Layout Plans */}
          <TabsContent value="layout" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Station Layout Areas</CardTitle>
                <CardDescription>Site maps showing different areas and their equipment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {currentLayoutAreas.map((area) => (
                    <Card key={area.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{area.name}</CardTitle>
                        <CardDescription>{area.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Location</Label>
                          <p className="text-sm">{area.coordinates}</p>
                        </div>
                        {area.area && (
                          <div>
                            <Label className="text-sm font-medium">Area</Label>
                            <p className="text-sm">{area.area}</p>
                          </div>
                        )}
                        {area.capacity && (
                          <div>
                            <Label className="text-sm font-medium">Capacity</Label>
                            <p className="text-sm">{area.capacity}</p>
                          </div>
                        )}
                        <div>
                          <Label className="text-sm font-medium">Equipment</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {area.equipment?.map((item, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {area.photos?.map((photo, index) => (
                            <img
                              key={index}
                              src={photo || "/placeholder.svg"}
                              alt={`${area.name} photo ${index + 1}`}
                              className="rounded-lg border cursor-pointer hover:opacity-80"
                              onClick={() => setSelectedImage(photo)}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equipment Inventory */}
          <TabsContent value="equipment" className="space-y-4">
            {currentEquipment.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                  <CardDescription>Detailed inventory of {category.category.toLowerCase()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name/Model</TableHead>
                        <TableHead>Serial Number</TableHead>
                        <TableHead>Install Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Specifications</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {category.items?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">{item.model}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{item.serialNumber}</TableCell>
                          <TableCell>{item.installDate}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">{item.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {item.fuelTypes && <p>Fuel: {item.fuelTypes.join(", ")}</p>}
                              {item.capacity && <p>Capacity: {item.capacity}</p>}
                              {item.nozzles && <p>Nozzles: {item.nozzles}</p>}
                              {item.specifications && <p>Specs: {item.specifications}</p>}
                              {item.currentLevel && <p>Level: {item.currentLevel}</p>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Utility Connections */}
          <TabsContent value="utilities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Utility Connections
                </CardTitle>
                <CardDescription>Electrical panels, water lines, and emergency shutoffs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentUtilities.map((utility, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {utility.type === "Electrical" && <Zap className="h-4 w-4" />}
                            {utility.type === "Water" && <Droplets className="h-4 w-4" />}
                            {(utility.type === "Emergency Systems" || utility.type === "HVAC") && (
                              <AlertTriangle className="h-4 w-4" />
                            )}
                            {utility.type}
                          </CardTitle>
                          <Badge
                            className={
                              utility.status === "Excellent"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }
                          >
                            {utility.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Description</Label>
                            <p className="text-sm">{utility.description}</p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Location</Label>
                            <p className="text-sm">{utility.location}</p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Specifications</Label>
                            <p className="text-sm">{utility.specifications}</p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Emergency Shutoff</Label>
                            <p className="text-sm">{utility.emergencyShutoff}</p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Last Inspection</Label>
                            <p className="text-sm">{utility.lastInspection}</p>
                          </div>
                          {utility.contractor && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Contractor</Label>
                              <p className="text-sm">{utility.contractor}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Safety Infrastructure */}
          <TabsContent value="safety" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Safety Infrastructure
                </CardTitle>
                <CardDescription>Fire extinguishers, spill kits, emergency exits, and safety equipment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentSafety.map((safety, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{safety.type}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Qty: {safety.quantity}</Badge>
                            <Badge className="bg-green-100 text-green-800">{safety.status}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Locations</Label>
                            <div className="space-y-1">
                              {safety.locations?.map((location, idx) => (
                                <p key={idx} className="text-sm">
                                  • {location}
                                </p>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Inspection Schedule</Label>
                            <p className="text-sm">Last: {safety.lastInspection}</p>
                            <p className="text-sm">Next: {safety.nextInspection}</p>
                          </div>
                          {safety.specifications && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Specifications</Label>
                              <p className="text-sm">{safety.specifications}</p>
                            </div>
                          )}
                          {safety.contractor && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Contractor</Label>
                              <p className="text-sm">{safety.contractor}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Asset Photos */}
          <TabsContent value="photos" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Station Photos
                    </CardTitle>
                    <CardDescription>Site overview and asset identification photos</CardDescription>
                  </div>
                  <Button disabled={loading.upload}>
                    {loading.upload ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    Upload Photos
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {currentPhotos.map((photo) => (
                    <Card key={photo.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img
                          src={photo.url || "/placeholder.svg"}
                          alt={photo.title}
                          className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                          onClick={() => setSelectedImage(photo.url)}
                        />
                        <Badge className="absolute top-2 right-2 bg-black/70 text-white">{photo.category}</Badge>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium">{photo.title}</h4>
                        <p className="text-sm text-muted-foreground">{photo.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">Taken: {photo.dateTaken}</p>
                        {photo.photographer && (
                          <p className="text-xs text-muted-foreground">By: {photo.photographer}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Image Preview Dialog */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Image Preview</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Preview"
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Station Form */}
      <AddStationForm
        isOpen={showAddStationForm}
        onClose={() => setShowAddStationForm(false)}
        onSubmit={(stationData) => {
          console.log("New station added:", stationData)
          // Here you would typically dispatch to Redux or call an API
          toast.success(`Station ${stationData.stationName} added successfully!`)
          // Optionally refresh the stations list
          dispatch(fetchStations())
        }}
      />
    </div>
  )
}
