"use client"

import { useState, useCallback } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Check, Building2 } from "lucide-react"
import { toast } from "sonner"
import { UserPlus } from "lucide-react"

export default function AddUserForm({ isOpen, onClose, onSubmit }) {
  const [loading, setLoading] = useState(false)
  
  // Station search states
  const [stationSearchTerm, setStationSearchTerm] = useState("")
  const [stationSearchResults, setStationSearchResults] = useState([])
  const [isStationSearching, setIsStationSearching] = useState(false)
  const [showStationSearch, setShowStationSearch] = useState(false)
  const [selectedStation, setSelectedStation] = useState(null)

  // Search stations function
  const searchStations = useCallback(async (term) => {
    if (!term.trim()) {
      setStationSearchResults([])
      return
    }

    setIsStationSearching(true)
    try {
      const response = await fetch(`https://cmms-back.vercel.app/api/stations/search?q=${encodeURIComponent(term.trim())}`)
      
      if (!response.ok) {
        throw new Error('Failed to search stations')
      }

      const results = await response.json()
      setStationSearchResults(results.stations || results || [])
    } catch (error) {
      console.error("Station search error:", error)
      toast.error("Failed to search stations")
      setStationSearchResults([])
    } finally {
      setIsStationSearching(false)
    }
  }, [])

  // Handle station selection
  const handleStationSelect = (station) => {
    setSelectedStation(station)
    setShowStationSearch(false)
    setStationSearchTerm("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedStation) {
      toast.error("Please select a station")
      return
    }
    
    setLoading(true)

    try {
      const formData = new FormData(e.target)
      const userData = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        role: formData.get("role"),
        status: formData.get("status"),
        station_Name: selectedStation.name || selectedStation.stationName || selectedStation.Station_Name,
        stationId: selectedStation.id || selectedStation._id,
        password: formData.get("password"),
      }

      await onSubmit(userData)
      toast.success("User created successfully")
      onClose()
      
      // Reset form
      e.target.reset()
      setSelectedStation(null)
      setStationSearchTerm("")
      setStationSearchResults([])
    } catch (error) {
      console.error("Error creating user:", error)
      // Provide more specific error messages
      if (error.message?.includes("duplicate") || error.message?.includes("User already exists!")) {
        toast.error("User with this email already exists")
      } else if (error.message?.includes("validation")) {
        toast.error("Please check your input data")
      } else {
        toast.error("Failed to create user. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle dialog close
  const handleClose = () => {
    setSelectedStation(null)
    setStationSearchTerm("")
    setStationSearchResults([])
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New User
          </DialogTitle>
          <DialogDescription>
            Create a new user account for your gas station staff.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  placeholder="Ahmed" 
                  required 
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input 
                  id="lastName" 
                  name="lastName" 
                  placeholder="Al-Rashid" 
                  required 
                  disabled={loading}
                />
              </div>
            </div>

            {/* Station Name */}
            <div className="space-y-2">
              <Label htmlFor="station_Name">Station Name *</Label>
              <Popover open={showStationSearch} onOpenChange={setShowStationSearch}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={showStationSearch}
                    className="w-full justify-between"
                  >
                    {selectedStation ? (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        <div className="text-left">
                          <div className="font-medium">{selectedStation.name || selectedStation.stationName || selectedStation.Station_Name}</div>
                          <div className="text-xs text-muted-foreground">{selectedStation.city || selectedStation.location || ""}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Search and select station...</span>
                    )}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search stations by name..."
                      value={stationSearchTerm}
                      onValueChange={(value) => {
                        setStationSearchTerm(value)
                        searchStations(value)
                      }}
                    />
                    <CommandList>
                      {isStationSearching ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            Loading...
                          </div>
                        </div>
                      ) : stationSearchResults.length === 0 && stationSearchTerm ? (
                        <CommandEmpty>No stations found.</CommandEmpty>
                      ) : stationSearchResults.length === 0 && !stationSearchTerm ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          Start typing to search stations...
                        </div>
                      ) : (
                        <CommandGroup>
                          {stationSearchResults.map((station) => (
                            <CommandItem
                              key={station.id || station._id}
                              value={station.id || station._id}
                              onSelect={() => handleStationSelect(station)}
                              className="flex items-center gap-3 p-3"
                            >
                              <Building2 className="h-4 w-4 text-blue-600" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{station.name || station.stationName || station.Station_Name}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {station.type || "Gas Station"}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">{station.city || station.location || ""}</div>
                                <div className="text-xs text-muted-foreground">{station.address || ""}</div>
                              </div>
                              {selectedStation?.id === (station.id || station._id) && <Check className="h-4 w-4 text-blue-600" />}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedStation && (
                <p className="text-xs text-blue-600 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Station selected: {selectedStation.name || selectedStation.stationName || selectedStation.Station_Name}
                </p>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="user@gasstation.sa" 
                  required 
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  placeholder="+966 50 123 4567" 
                  required 
                  disabled={loading}
                />
              </div>
            </div>

            {/* Role and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select name="role" required disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Technician">Technician</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select name="status" defaultValue="Active" required disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Temporary Password *</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="Temporary password" 
                required 
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                User will be prompted to change this password on first login
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !selectedStation}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 