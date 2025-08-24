"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Wrench, ImageIcon, Eye, Edit } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import AddStationForm from "@/components/add-station-form"
export default function StationDetailsPage() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [showAddStationForm,setShowAddStationForm] =useState(false)
  // Station data
  const stationData = {
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
    assets: [
      {
        id: 1,
        category: "Pumps",
        name: "Pump 1",
        description: "Pump 1 description",
        status: "Active",
        location: "Location 1",
        lastMaintenance: "2024-01-01",
        nextMaintenance: "2024-01-01",
      },
      {
        id: 2,
        category: "Pumps",
        name: "Pump 2",
        description: "Pump 2 description",
        status: "Active",
        location: "Location 2",
        lastMaintenance: "2024-01-01",
        nextMaintenance: "2024-01-01",
      },
    ],
    Workers: [
      {
        id: 1,
        name: "John Doe",
        role: "Manager",
        email: "john.doe@example.com",
        phone: "+1234567890",
      },
      {
        id: 2,
        name: "Jane Doe",
        role: "Technician",
        email: "jane.doe@example.com",
        phone: "+1234567890",
      },
      {
        id: 3,
        name: "Jim Doe",
        role: "Technician",
        email: "jim.doe@example.com",
        phone: "+1234567890",
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
  }
const handleAddStation = ()=>{
// doit
}

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "Manager":
        return "bg-blue-100 text-blue-800"
      case "Technician":
        return "bg-green-100 text-green-800"
      case "Admin":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Station Details</h1>
          <p className="text-muted-foreground">Comprehensive information about Al-Noor Gas Station</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Station
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={ ()=>setShowAddStationForm(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Add Station
          </Button>
        </div>
      </div>

      {/* Station Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Station Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{stationData.stationInfo.name}</h3>
              <p className="text-sm text-muted-foreground">{stationData.stationInfo.location}</p>
            </div>
            
            <div className="grid gap-3">
              <div>
                <span className="text-sm font-medium">GPS Coordinates</span>
                <p className="text-sm font-mono">{stationData.stationInfo.gpsCoordinates}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Station Code</span>
                <p className="text-sm">{stationData.stationInfo.stationCode}</p>
              </div>
              <div>
                <span className="text-sm font-medium">License Number</span>
                <p className="text-sm">{stationData.stationInfo.licenseNumber}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Operating Hours</span>
                <p className="text-sm">{stationData.stationInfo.operatingHours}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Established</span>
                <p className="text-sm">{stationData.stationInfo.establishedDate}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Total Area</span>
                <p className="text-sm">{stationData.stationInfo.totalArea}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm font-medium">Phone</span>
              <p className="text-sm">{stationData.stationInfo.contactInfo.phone}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Email</span>
              <p className="text-sm">{stationData.stationInfo.contactInfo.email}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Station Manager</span>
              <p className="text-sm">{stationData.stationInfo.contactInfo.manager}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Fuel Brands</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {stationData.stationInfo.fuelBrands.map((brand, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {brand}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stationData.assets.length}</div>
            <p className="text-xs text-muted-foreground">Total assets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stationData.Workers.length}</div>
            <p className="text-xs text-muted-foreground">Station staff</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stationData.photos.length}</div>
            <p className="text-xs text-muted-foreground">Station photos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stationData.assets.filter(asset => asset.status === "Active").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Assets, Workers, and Photos */}
      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assets" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Assets
          </TabsTrigger>
          <TabsTrigger value="workers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Workers
          </TabsTrigger>
          <TabsTrigger value="photos" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Photos
          </TabsTrigger>
        </TabsList>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Station Assets</CardTitle>
              <CardDescription>Equipment and machinery at the station</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Last Maintenance</TableHead>
                    <TableHead>Next Maintenance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stationData.assets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>{asset.category}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(asset.status)}>
                          {asset.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{asset.location}</TableCell>
                      <TableCell>{asset.lastMaintenance}</TableCell>
                      <TableCell>{asset.nextMaintenance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workers Tab */}
        <TabsContent value="workers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Station Workers</CardTitle>
              <CardDescription>Staff members and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stationData.Workers.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell className="font-medium">{worker.name}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(worker.role)}>
                          {worker.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{worker.email}</TableCell>
                      <TableCell>{worker.phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Photos Tab */}
        <TabsContent value="photos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Station Photos</CardTitle>
              <CardDescription>Documentation and visual records of the station</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stationData.photos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedImage(photo)}
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-sm">{photo.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{photo.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">
                          {photo.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{photo.dateTaken}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Photo Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img
              src={selectedImage?.url}
              alt={selectedImage?.title}
              className="w-full h-auto rounded-lg"
            />
            <div className="space-y-2">
              <p className="text-sm">{selectedImage?.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Category: {selectedImage?.category}</span>
                <span>Date: {selectedImage?.dateTaken}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Photographer: {selectedImage?.photographer}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <AddStationForm
        isOpen={showAddStationForm}
        onClose={() => setShowAddStationForm(false)}
        onSubmit={handleAddStation}
      />
    </div>
  )
}
