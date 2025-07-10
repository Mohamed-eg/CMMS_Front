import { API_CONFIG, buildApiUrl, apiRequest } from "../config/api"

// Mock data for development/fallback
const mockAssets = [
  {
    id: "DISP-001",
    name: "Fuel Dispenser A1",
    type: "Fuel Dispenser",
    category: "Fuel Dispensing",
    station: "Al-Noor Gas Station - Riyadh",
    stationId: "STN-001",
    status: "Active",
    condition: "Good",
    location: "Bay 1",
    model: "Wayne Ovation",
    manufacturer: "Wayne Fueling Systems",
    serialNumber: "WO-2023-001",
    installDate: "2023-01-15",
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-02-15",
    usageHours: 8760,
    flowRateAnomalies: 2,
    serviceFrequency: "Monthly",
    expectedLifespan: "10 years",
    gpsCoordinates: "24.7136° N, 46.6753° E",
    photos: ["/placeholder.svg?height=200&width=300"],
    specifications: {
      model: "Wayne Ovation II",
      fuelTypes: ["Gasoline 91", "Gasoline 95", "Diesel"],
      flowRate: "40 L/min",
      accuracy: "±0.3%",
    },
    maintenanceHistory: [
      { date: "2024-01-15", type: "Routine Inspection", technician: "Mohammed Al-Fahad", duration: "2 hours" },
      { date: "2023-12-15", type: "Calibration", technician: "Abdullah Al-Rashid", duration: "1.5 hours" },
    ],
  },
  {
    id: "DISP-002",
    name: "Fuel Dispenser A2",
    type: "Fuel Dispenser",
    category: "Fuel Dispensing",
    station: "Al-Noor Gas Station - Riyadh",
    stationId: "STN-001",
    status: "Active",
    condition: "Excellent",
    location: "Bay 2",
    model: "Wayne Ovation",
    manufacturer: "Wayne Fueling Systems",
    serialNumber: "WO-2023-002",
    installDate: "2023-01-15",
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-02-10",
    usageHours: 8500,
    flowRateAnomalies: 1,
    serviceFrequency: "Monthly",
    expectedLifespan: "10 years",
    gpsCoordinates: "24.7136° N, 46.6753° E",
    photos: ["/placeholder.svg?height=200&width=300"],
    specifications: {
      model: "Wayne Ovation II",
      fuelTypes: ["Gasoline 91", "Gasoline 95", "Diesel"],
      flowRate: "40 L/min",
      accuracy: "±0.3%",
    },
    maintenanceHistory: [
      { date: "2024-01-10", type: "Routine Inspection", technician: "Mohammed Al-Fahad", duration: "2 hours" },
      { date: "2023-12-10", type: "Filter Replacement", technician: "Abdullah Al-Rashid", duration: "1 hour" },
    ],
  },
  {
    id: "PUMP-001",
    name: "Underground Pump 1",
    type: "Fuel Pump",
    category: "Fuel Dispensing",
    station: "Al-Noor Gas Station - Riyadh",
    stationId: "STN-001",
    status: "Active",
    condition: "Good",
    location: "Underground Tank 1",
    model: "Franklin Electric",
    manufacturer: "Franklin Electric",
    serialNumber: "FE-2023-001",
    installDate: "2023-01-10",
    lastMaintenance: "2024-01-05",
    nextMaintenance: "2024-02-05",
    usageHours: 4380,
    flowRateAnomalies: 0,
    serviceFrequency: "Monthly",
    expectedLifespan: "10 years",
    gpsCoordinates: "24.7136° N, 46.6753° E",
    photos: ["/placeholder.svg?height=200&width=300"],
    specifications: {
      model: "FE 1000",
      power: "1000 W",
      flowRate: "100 L/min",
      efficiency: "95%",
    },
    maintenanceHistory: [
      { date: "2024-01-05", type: "Routine Inspection", technician: "Mohammed Al-Fahad", duration: "2 hours" },
      { date: "2023-12-05", type: "Motor Check", technician: "Abdullah Al-Rashid", duration: "1.5 hours" },
    ],
  },
  {
    id: "TANK-001",
    name: "Gasoline Storage Tank",
    type: "Storage Tank",
    category: "Storage",
    station: "Al-Noor Gas Station - Riyadh",
    stationId: "STN-001",
    status: "Active",
    condition: "Excellent",
    location: "Underground",
    model: "Xerxes FRP",
    manufacturer: "Containment Solutions",
    serialNumber: "XE-2023-001",
    capacity: "30000L",
    installDate: "2023-01-05",
    lastMaintenance: "2024-01-01",
    nextMaintenance: "2024-04-01",
    usageHours: 4380,
    flowRateAnomalies: 0,
    serviceFrequency: "Quarterly",
    expectedLifespan: "15 years",
    gpsCoordinates: "24.7136° N, 46.6753° E",
    photos: ["/placeholder.svg?height=200&width=300"],
    specifications: {
      model: "CSI Double Wall",
      capacity: "30,000 liters",
      material: "Fiberglass",
      leakDetection: "Integrated sensor",
    },
    maintenanceHistory: [
      { date: "2024-01-01", type: "Integrity Test", technician: "Faisal Al-Khalid", duration: "3 hours" },
      { date: "2023-10-01", type: "Visual Inspection", technician: "Nasser Al-Salem", duration: "1 hour" },
    ],
  },
  {
    id: "COMP-001",
    name: "Air Compressor",
    type: "Compressor",
    category: "Utility",
    station: "Al-Noor Gas Station - Riyadh",
    stationId: "STN-001",
    status: "Maintenance Required",
    condition: "Fair",
    location: "Service Bay",
    model: "Atlas Copco",
    manufacturer: "Atlas Copco",
    serialNumber: "AC-2023-001",
    installDate: "2023-02-01",
    lastMaintenance: "2024-01-20",
    nextMaintenance: "2024-02-20",
    usageHours: 6570,
    flowRateAnomalies: 5,
    serviceFrequency: "Bi-Monthly",
    expectedLifespan: "8 years",
    gpsCoordinates: "24.7136° N, 46.6753° E",
    photos: ["/placeholder.svg?height=200&width=300"],
    specifications: {
      model: "GA 11 VSD+",
      power: "11 kW",
      pressure: "7-13 bar",
      airDelivery: "1.5-3.5 m³/min",
    },
    maintenanceHistory: [
      { date: "2024-01-20", type: "Filter Replacement", technician: "Saleh Al-Otaibi", duration: "2 hours" },
      { date: "2023-11-20", type: "Oil Change", technician: "Omar Al-Zahrani", duration: "1.5 hours" },
    ],
  },
  {
    id: "FIRE-001",
    name: "Fire Suppression System",
    type: "Fire System",
    category: "Safety",
    station: "Al-Noor Gas Station - Riyadh",
    stationId: "STN-001",
    status: "Active",
    condition: "Good",
    location: "Station Wide",
    model: "Ansul R-102",
    manufacturer: "Ansul",
    serialNumber: "AN-2023-001",
    installDate: "2023-01-12",
    lastMaintenance: "2024-01-08",
    nextMaintenance: "2024-02-08",
    usageHours: 0,
    flowRateAnomalies: 0,
    serviceFrequency: "Monthly",
    expectedLifespan: "12 years",
    gpsCoordinates: "24.7136° N, 46.6753° E",
    photos: ["/placeholder.svg?height=200&width=300"],
    specifications: {
      model: "R-102",
      agentType: "Wet Chemical",
      coverageArea: "500 sq ft",
      dischargeTime: "60 seconds",
    },
    maintenanceHistory: [
      { date: "2024-01-08", type: "Pressure Check", technician: "Ziad Al-Ghamdi", duration: "1 hour" },
      { date: "2023-12-08", type: "System Inspection", technician: "Fahad Al-Dosari", duration: "2 hours" },
    ],
  },
]

// Assets API functions
export const assetsAPI = {
  // Get all assets
  getAssets: async (filters = {}) => {
    try {
      console.log("📊 Fetching assets with filters:", filters)

      // Try API first
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.ASSETS.LIST)
      const queryParams = new URLSearchParams()

      // Add filters as query parameters
      if (filters.category && filters.category !== "all") queryParams.append("category", filters.category)
      if (filters.status && filters.status !== "all") queryParams.append("status", filters.status)
      if (filters.search) queryParams.append("search", filters.search)
      if (filters.stationId) queryParams.append("stationId", filters.stationId)

      const fullUrl = queryParams.toString() ? `${url}?${queryParams}` : url

      const data = await apiRequest(fullUrl, {
        method: "GET",
      })

      console.log("✅ Assets fetched from API:", data.length)
      return { assets: data, success: true }
    } catch (error) {
      console.warn("⚠️ API unavailable, using mock data:", error.message)

      // Fallback to mock data
      let filteredAssets = [...mockAssets]

      // Apply filters to mock data
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredAssets = filteredAssets.filter(
          (asset) =>
            (asset.name || "").toLowerCase().includes(searchTerm) ||
            (asset.id || "").toLowerCase().includes(searchTerm) ||
            (asset.type || "").toLowerCase().includes(searchTerm) ||
            (asset.location || "").toLowerCase().includes(searchTerm),
        )
      }

      if (filters.category && filters.category !== "all") {
        filteredAssets = filteredAssets.filter((asset) => asset.category === filters.category)
      }

      if (filters.status && filters.status !== "all") {
        filteredAssets = filteredAssets.filter((asset) => asset.status === filters.status)
      }

      return { assets: filteredAssets, success: false, error: error.message }
    }
  },

  // Search assets (for equipment search in work orders)
  searchAssets: async (searchTerm = "") => {
    try {
      console.log("🔍 Searching assets:", searchTerm)

      if (!searchTerm.trim()) {
        // Return all assets if no search term
        const result = await assetsAPI.getAssets()
        return result.assets || []
      }

      // Try API first
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.ASSETS.SEARCH)
      const data = await apiRequest(`${url}?q=${encodeURIComponent(searchTerm)}`, {
        method: "GET",
      })

      console.log("✅ Asset search results from API:", data.length)
      return data
    } catch (error) {
      console.warn("⚠️ Search API unavailable, using mock data:", error.message)

      // Fallback to mock data search
      const searchLower = searchTerm.toLowerCase()
      const filteredAssets = mockAssets.filter(
        (asset) =>
          (asset.name || "").toLowerCase().includes(searchLower) ||
          (asset.id || "").toLowerCase().includes(searchLower) ||
          (asset.type || "").toLowerCase().includes(searchLower) ||
          (asset.station || "").toLowerCase().includes(searchLower),
      )

      return filteredAssets
    }
  },

  // Get asset statistics
  getAssetStats: async () => {
    try {
      console.log("📊 Fetching asset statistics")

      const url = buildApiUrl(API_CONFIG.ENDPOINTS.ASSETS.STATS)
      const data = await apiRequest(url, {
        method: "GET",
      })

      console.log("✅ Asset stats fetched from API")
      return data
    } catch (error) {
      console.warn("⚠️ Stats API unavailable, calculating from mock data:", error.message)

      // Calculate stats from mock data
      const totalAssets = mockAssets.length
      const activeAssets = mockAssets.filter((asset) => asset.status === "Active").length
      const maintenanceAssets = mockAssets.filter((asset) => asset.status === "Maintenance Required").length
      const inactiveAssets = mockAssets.filter((asset) => asset.status === "Inactive").length
      const excellentCondition = mockAssets.filter((asset) => asset.condition === "Excellent").length

      const assetsByCategory = {}
      mockAssets.forEach((asset) => {
        const category = asset.category || "Unknown"
        assetsByCategory[category] = (assetsByCategory[category] || 0) + 1
      })

      return {
        total: totalAssets,
        active: activeAssets,
        maintenance: maintenanceAssets,
        inactive: inactiveAssets,
        excellent: excellentCondition,
        byCategory: assetsByCategory,
      }
    }
  },

  // Create new asset
  createAsset: async (assetData) => {
    try {
      console.log("➕ Creating new asset:", assetData.name)

      const url = buildApiUrl(API_CONFIG.ENDPOINTS.ASSETS.CREATE)
      const data = await apiRequest(url, {
        method: "POST",
        body: JSON.stringify(assetData),
      })

      console.log("✅ Asset created successfully")
      return data
    } catch (error) {
      console.error("❌ Error creating asset:", error.message)
      throw error
    }
  },

  // Update asset
  updateAsset: async (assetId, assetData) => {
    try {
      console.log("✏️ Updating asset:", assetId)

      const url = buildApiUrl(API_CONFIG.ENDPOINTS.ASSETS.UPDATE, { id: assetId })
      const data = await apiRequest(url, {
        method: "PUT",
        body: JSON.stringify(assetData),
      })

      console.log("✅ Asset updated successfully")
      return data
    } catch (error) {
      console.error("❌ Error updating asset:", error.message)
      throw error
    }
  },

  // Delete asset
  deleteAsset: async (assetId) => {
    try {
      console.log("🗑️ Deleting asset:", assetId)

      const url = buildApiUrl(API_CONFIG.ENDPOINTS.ASSETS.DELETE, { id: assetId })
      await apiRequest(url, {
        method: "DELETE",
      })

      console.log("✅ Asset deleted successfully")
      return { success: true }
    } catch (error) {
      console.error("❌ Error deleting asset:", error.message)
      throw error
    }
  },
}

// Export individual functions for convenience and compatibility
export const getAssets = assetsAPI.getAssets
export const searchAssets = assetsAPI.searchAssets
export const getAssetStats = assetsAPI.getAssetStats
export const createAsset = assetsAPI.createAsset
export const updateAsset = assetsAPI.updateAsset
export const deleteAsset = assetsAPI.deleteAsset

// Export with different names for compatibility
export const fetchAssets = assetsAPI.getAssets
export const fetchAssetStats = assetsAPI.getAssetStats

// Default export
export default assetsAPI
