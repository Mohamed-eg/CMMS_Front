import { API_CONFIG, buildApiUrl, getAuthHeaders, handleApiResponse } from "../config/api"

// Get all work orders with optional filters
export const getWorkOrders = async (filters = {}) => {
  try {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.WORK_ORDERS)
    const queryParams = new URLSearchParams()

    // Add filters as query parameters
    if (filters.status) queryParams.append("status", filters.status)
    if (filters.priority) queryParams.append("priority", filters.priority)
    if (filters.search) queryParams.append("search", filters.search)
    if (filters.assignedTo) queryParams.append("assignedTo", filters.assignedTo)
    if (filters.stationId) queryParams.append("stationId", filters.stationId)

    const fullUrl = queryParams.toString() ? `${url}?${queryParams}` : url

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error("Error fetching work orders:", error)
    throw error
  }
}

// Get work order statistics
export const getWorkOrderStats = async () => {
  try {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.WORK_ORDERS_STATS)

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error("Error fetching work order stats:", error)
    throw error
  }
}

// Create a new work order
export const createWorkOrder = async (workOrderData) => {
  try {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.WORK_ORDERS)

    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(workOrderData),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error("Error creating work order:", error)
    throw error
  }
}

// Update a work order
export const updateWorkOrder = async (id, workOrderData) => {
  try {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.WORK_ORDERS}/${id}`)

    const response = await fetch(url, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(workOrderData),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error("Error updating work order:", error)
    throw error
  }
}

// Delete a work order
export const deleteWorkOrder = async (id) => {
  try {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.WORK_ORDERS}/${id}`)

    const response = await fetch(url, {
      method: "DELETE",
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error("Error deleting work order:", error)
    throw error
  }
}

// Get a single work order by ID
export const getWorkOrder = async (id) => {
  try {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.WORK_ORDERS}/${id}`)

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error("Error fetching work order:", error)
    throw error
  }
}
