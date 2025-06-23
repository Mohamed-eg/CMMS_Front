import api from "./axios"

// Station API endpoints
export const stationsApi = {
  // Get all stations
  getAllStations: async () => {
    try {
      const response = await api.get("/stations")
      return response.data
    } catch (error) {
      console.error("Error fetching stations:", error)
      throw error
    }
  },

  // Get station by ID
  getStationById: async (stationId) => {
    try {
      const response = await api.get(`/stations/${stationId}`)
      return response.data
    } catch (error) {
      console.error("Error fetching station details:", error)
      throw error
    }
  },

  // Get station equipment
  getStationEquipment: async (stationId) => {
    try {
      const response = await api.get(`/stations/${stationId}/equipment`)
      return response.data
    } catch (error) {
      console.error("Error fetching station equipment:", error)
      throw error
    }
  },

  // Get station utilities
  getStationUtilities: async (stationId) => {
    try {
      const response = await api.get(`/stations/${stationId}/utilities`)
      return response.data
    } catch (error) {
      console.error("Error fetching station utilities:", error)
      throw error
    }
  },

  // Get station safety equipment
  getStationSafety: async (stationId) => {
    try {
      const response = await api.get(`/stations/${stationId}/safety`)
      return response.data
    } catch (error) {
      console.error("Error fetching station safety equipment:", error)
      throw error
    }
  },

  // Get station photos
  getStationPhotos: async (stationId) => {
    try {
      const response = await api.get(`/stations/${stationId}/photos`)
      return response.data
    } catch (error) {
      console.error("Error fetching station photos:", error)
      throw error
    }
  },

  // Upload station photo
  uploadStationPhoto: async (stationId, photoData) => {
    try {
      const formData = new FormData()
      formData.append("photo", photoData.file)
      formData.append("title", photoData.title)
      formData.append("description", photoData.description)
      formData.append("category", photoData.category)

      const response = await api.post(`/stations/${stationId}/photos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    } catch (error) {
      console.error("Error uploading station photo:", error)
      throw error
    }
  },

  // Update station information
  updateStation: async (stationId, stationData) => {
    try {
      const response = await api.put(`/stations/${stationId}`, stationData)
      return response.data
    } catch (error) {
      console.error("Error updating station:", error)
      throw error
    }
  },

  // Create new station
  createStation: async (stationData) => {
    try {
      const response = await api.post("/stations", stationData)
      return response.data
    } catch (error) {
      console.error("Error creating station:", error)
      throw error
    }
  },

  // Delete station
  deleteStation: async (stationId) => {
    try {
      const response = await api.delete(`/stations/${stationId}`)
      return response.data
    } catch (error) {
      console.error("Error deleting station:", error)
      throw error
    }
  },
}
