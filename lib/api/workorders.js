import { API_CONFIG, buildApiUrl, getAuthHeaders, handleApiResponse } from "../config/api"

// Get all work orders with optional filters
export const getWorkOrders = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams()

    if (filters.status && filters.status !== "all") {
      queryParams.append("status", filters.status)
    }
    if (filters.priority && filters.priority !== "all") {
      queryParams.append("priority", filters.priority)
    }
    if (filters.search) {
      queryParams.append("search", filters.search)
    }
    if (filters.assignedTo) {
      queryParams.append("assignedTo", filters.assignedTo)
    }
    if (filters.station) {
      queryParams.append("station", filters.station)
    }

    const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.WORK_ORDERS.LIST)}?${queryParams.toString()}`

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
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
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.WORK_ORDERS.STATS), {
      method: "GET",
      headers: getAuthHeaders(),
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
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.WORK_ORDERS.CREATE), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(workOrderData),
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
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.WORK_ORDERS.UPDATE, { id }), {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(workOrderData),
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
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.WORK_ORDERS.DELETE, { id }), {
      method: "DELETE",
      headers: getAuthHeaders(),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error("Error deleting work order:", error)
    throw error
  }
}

// Get work order by ID
export const getWorkOrderById = async (id) => {
  try {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.WORK_ORDERS.LIST + `/${id}`), {
      method: "GET",
      headers: getAuthHeaders(),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error("Error fetching work order:", error)
    throw error
  }
}

// Export all functions as workOrdersAPI object
export const workOrdersAPI = {
  getWorkOrders,
  getWorkOrderStats,
  createWorkOrder,
  updateWorkOrder,
  deleteWorkOrder,
  getWorkOrderById,
}
