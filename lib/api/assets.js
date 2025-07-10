import { API_CONFIG, buildApiUrl, getAuthHeaders, handleApiResponse } from "../config/api"

// Get all assets with optional filters
export const getAssets = async (filters = {}) => {
  try {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.ASSETS)
    const queryParams = new URLSearchParams()

    // Add filters as query parameters
    if (filters.category) queryParams.append("category", filters.category)
    if (filters.status) queryParams.append("status", filters.status)
    if (filters.search) queryParams.append("search", filters.search)
    if (filters.stationId) queryParams.append("stationId", filters.stationId)

    const fullUrl = queryParams.toString() ? `${url}?${queryParams}` : url

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error("Error fetching assets:", error)
    throw error
  }
}

// Get asset statistics
export const getAssetStats = async () => {
  try {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.ASSETS_STATS)

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error("Error fetching asset stats:", error)
    throw error
  }
}

// Create a new asset
export const createAsset = async (assetData) => {
  try {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.ASSETS)

    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(assetData),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error("Error creating asset:", error)
    throw error
  }
}

// Update an asset
export const updateAsset = async (id, assetData) => {
  try {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ASSETS}/${id}`)

    const response = await fetch(url, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(assetData),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error("Error updating asset:", error)
    throw error
  }
}

// Delete an asset
export const deleteAsset = async (id) => {
  try {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ASSETS}/${id}`)

    const response = await fetch(url, {
      method: "DELETE",
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error("Error deleting asset:", error)
    throw error
  }
}

// Get a single asset by ID
export const getAsset = async (id) => {
  try {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ASSETS}/${id}`)

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error("Error fetching asset:", error)
    throw error
  }
}
