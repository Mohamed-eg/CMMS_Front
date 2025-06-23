"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Upload, Eye, Edit, Zap, Droplets, AlertTriangle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImageIcon } from "lucide-react"

export default function StationDetailsPage() {
  const [selectedImage, setSelectedImage] = useState(null)

  const stationInfo = {
    name: "Al-Rashid Gas Station",
    location: "King Fahd Road, Riyadh, Saudi Arabia",
    gpsCoordinates: "24.7136° N, 46.6753° E",
    contactInfo: {
      phone: "+966 11 234 5678",
      email: "info@alrashid-gas.sa",
      manager: "Ahmed Al-Rashid",
    },
    operatingHours: "24/7",
    stationCode: "GS-RYD-001",
    licenseNumber: "GS-2023-001",
  }

  const layoutAreas = [
    {
      id: "pump-islands",
      name: "Pump Islands",
      description: "4 pump islands with 8 dispensers total",
      coordinates: "Center area",
      equipment: ["8 Fuel Dispensers", "Canopy Structure", "LED Lighting"],
      photos: ["/placeholder.svg?height=200&width=300"],
    },
    {
      id: "storage-tanks",
      name: "Underground Storage Tanks",
      description: "3 underground fuel storage tanks",
      coordinates: "North side underground",
      equipment: ["Tank #1 (Gasoline 91)", "Tank #2 (Gasoline 95)", "Tank #3 (Diesel)"],
      photos: ["/placeholder.svg?height=200&width=300"],
    },
    {
      id: "convenience-store",
      name: "Convenience Store",
      description: "Customer service area and retail space",
      coordinates: "East side building",
      equipment: ["POS Systems", "Refrigeration Units", "HVAC System"],
      photos: ["/placeholder.svg?height=200&width=300"],
    },
    {
      id: "utility-area",
      name: "Utility & Equipment Area",
      description: "Technical equipment and utility connections",
      coordinates: "West side",
      equipment: ["Electrical Panels", "Water Connections", "Air Compressor"],
      photos: ["/placeholder.svg?height=200&width=300"],
    },
  ]

  const equipmentInventory = [
    {
      category: "Fuel Dispensers",
      items: [
        {
          id: "DISP-001",
          name: "Wayne Ovation II - Island A1",
          model: "Wayne Ovation II",
          serialNumber: "WO-2023-001",
          installDate: "2023-03-15",
          status: "Active",
          fuelTypes: ["Gasoline 91", "Gasoline 95"],
          nozzles: 2,
          hoses: 2,
        },
        {
          id: "DISP-002",
          name: "Wayne Ovation II - Island A2",
          model: "Wayne Ovation II",
          serialNumber: "WO-2023-002",
          installDate: "2023-03-15",
          status: "Active",
          fuelTypes: ["Gasoline 91", "Diesel"],
          nozzles: 2,
          hoses: 2,
        },
      ],
    },
    {
      category: "Storage Tanks",
      items: [
        {
          id: "TANK-001",
          name: "Underground Tank #1",
          capacity: "50,000 L",
          fuelType: "Gasoline 91",
          installDate: "2022-08-20",
          status: "Active",
          lastInspection: "2024-01-10",
          material: "Fiberglass",
        },
        {
          id: "TANK-002",
          name: "Underground Tank #2",
          capacity: "50,000 L",
          fuelType: "Gasoline 95",
          installDate: "2022-08-20",
          status: "Active",
          lastInspection: "2024-01-10",
          material: "Fiberglass",
        },
      ],
    },
  ]

  const utilityConnections = [
    {
      type: "Electrical",
      description: "Main electrical panel and distribution",
      location: "Utility room",
      specifications: "400V, 3-phase, 200A main breaker",
      lastInspection: "2024-01-05",
      status: "Good",
      emergencyShutoff: "Yes",
    },
    {
      type: "Water",
      description: "Municipal water connection",
      location: "North side",
      specifications: "2-inch main line, 40 PSI",
      lastInspection: "2023-12-20",
      status: "Good",
      emergencyShutoff: "Yes",
    },
    {
      type: "Emergency Systems",
      description: "Emergency power and shutoff systems",
      location: "Multiple locations",
      specifications: "Backup generator, emergency stops",
      lastInspection: "2024-01-08",
      status: "Excellent",
      emergencyShutoff: "Multiple locations",
    },
  ]

  const safetyInfrastructure = [
    {
      type: "Fire Extinguishers",
      quantity: 12,
      locations: ["Pump islands (4)", "Store (3)", "Utility room (2)", "Office (2)", "Storage (1)"],
      lastInspection: "2024-01-15",
      nextInspection: "2024-04-15",
      status: "All functional",
    },
    {
      type: "Spill Kits",
      quantity: 6,
      locations: ["Each pump island (4)", "Storage area (1)", "Utility room (1)"],
      lastInspection: "2024-01-10",
      nextInspection: "2024-04-10",
      status: "Fully stocked",
    },
    {
      type: "Emergency Exits",
      quantity: 8,
      locations: ["Store exits (2)", "Office exits (2)", "Emergency routes (4)"],
      lastInspection: "2024-01-12",
      nextInspection: "2024-04-12",
      status: "Clear and marked",
    },
    {
      type: "Emergency Shutoffs",
      quantity: 5,
      locations: ["Main electrical", "Fuel pumps", "Gas line", "Water main", "Emergency stop"],
      lastInspection: "2024-01-08",
      nextInspection: "2024-04-08",
      status: "All operational",
    },
  ]

  const sitePhotos = [
    {
      id: 1,
      title: "Aerial View - Complete Station",
      description: "Wide-angle aerial shot showing entire station layout",
      category: "Site Overview",
      url: "/placeholder.svg?height=300&width=400",
      dateTaken: "2024-01-15",
    },
    {
      id: 2,
      title: "Pump Islands Overview",
      description: "Ground-level view of all pump islands",
      category: "Pump Area",
      url: "/placeholder.svg?height=300&width=400",
      dateTaken: "2024-01-15",
    },
    {
      id: 3,
      title: "Convenience Store Front",
      description: "Customer entrance and store front",
      category: "Store",
      url: "/placeholder.svg?height=300&width=400",
      dateTaken: "2024-01-15",
    },
    {
      id: 4,
      title: "Utility Equipment Area",
      description: "Technical equipment and utility connections",
      category: "Utilities",
      url: "/placeholder.svg?height=300&width=400",
      dateTaken: "2024-01-15",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Station Details</h1>
          <p className="text-muted-foreground">Comprehensive information about your gas station</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Documents
        </Button>
      </div>

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
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Station Name</Label>
                  <p className="text-sm">{stationInfo.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm">{stationInfo.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">GPS Coordinates</Label>
                  <p className="text-sm font-mono">{stationInfo.gpsCoordinates}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Station Code</Label>
                  <p className="text-sm">{stationInfo.stationCode}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">License Number</Label>
                  <p className="text-sm">{stationInfo.licenseNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Operating Hours</Label>
                  <p className="text-sm">{stationInfo.operatingHours}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm">{stationInfo.contactInfo.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{stationInfo.contactInfo.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Station Manager</Label>
                  <p className="text-sm">{stationInfo.contactInfo.manager}</p>
                </div>
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
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Active dispensers</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Storage Tanks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Underground tanks</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Safety Equipment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">31</div>
                <p className="text-xs text-muted-foreground">Safety items</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">150K</div>
                <p className="text-xs text-muted-foreground">Liters storage</p>
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
                {layoutAreas.map((area) => (
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
                      <div>
                        <Label className="text-sm font-medium">Equipment</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {area.equipment.map((item, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {area.photos.map((photo, index) => (
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
          {equipmentInventory.map((category) => (
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
                    {category.items.map((item) => (
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
                {utilityConnections.map((utility, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {utility.type === "Electrical" && <Zap className="h-4 w-4" />}
                          {utility.type === "Water" && <Droplets className="h-4 w-4" />}
                          {utility.type === "Emergency Systems" && <AlertTriangle className="h-4 w-4" />}
                          {utility.type}
                        </CardTitle>
                        <Badge
                          className={
                            utility.status === "Excellent" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
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
                {safetyInfrastructure.map((safety, index) => (
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
                            {safety.locations.map((location, idx) => (
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
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photos
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sitePhotos.map((photo) => (
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
    </div>
  )
}
