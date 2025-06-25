import { buildApiUrl, getAuthHeaders } from "../config/api"

// Fetch all assets
export const fetchAssets = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams()

    // Add filters to query params
    if (filters.category && filters.category !== "all") {
      queryParams.append("category", filters.category)
    }
    if (filters.status && filters.status !== "all") {
      queryParams.append("status", filters.status)
    }
    if (filters.search) {
      queryParams.append("search", filters.search)
    }

    const url = buildApiUrl("/api/assets") + (queryParams.toString() ? `?${queryParams.toString()}` : "")

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching assets:", error)
    throw error
  }
}

// Create new asset
export const createAsset = async (assetData) => {
  try {
    const response = await fetch(buildApiUrl("/api/assets"), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(assetData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error creating asset:", error)
    throw error
  }
}

// Update asset
export const updateAsset = async (id, assetData) => {
  try {
    const response = await fetch(buildApiUrl("/api/assets/:id", { id }), {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(assetData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error updating asset:", error)
    throw error
  }
}

// Delete asset
export const deleteAsset = async (id) => {
  try {
    const response = await fetch(buildApiUrl("/api/assets/:id", { id }), {
      method: "DELETE",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error("Error deleting asset:", error)
    throw error
  }
}

// Get asset by ID
export const fetchAssetById = async (id) => {
  try {
    const response = await fetch(buildApiUrl("/api/assets/:id", { id }), {
      method: "GET",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching asset:", error)
    throw error
  }
}

// Fetch asset statistics
export const fetchAssetStats = async () => {
  try {
    const response = await fetch(buildApiUrl("/api/assets/stats"), {
      method: "GET",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching asset stats:", error)
    throw error
  }
}
