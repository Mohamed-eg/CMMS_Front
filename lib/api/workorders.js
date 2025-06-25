import { buildApiUrl, getAuthHeaders } from "../config/api"

// Fetch all work orders
export const fetchWorkOrders = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams()

    // Add filters to query params
    if (filters.status && filters.status !== "all") {
      queryParams.append("status", filters.status)
    }
    if (filters.priority && filters.priority !== "all") {
      queryParams.append("priority", filters.priority)
    }
    if (filters.search) {
      queryParams.append("search", filters.search)
    }

    const url = buildApiUrl("/api/workorders") + (queryParams.toString() ? `?${queryParams.toString()}` : "")

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
    console.error("Error fetching work orders:", error)
    throw error
  }
}

// Create new work order
export const createWorkOrder = async (workOrderData) => {
  try {
    const response = await fetch(buildApiUrl("/api/workorders"), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(workOrderData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error creating work order:", error)
    throw error
  }
}

// Update work order
export const updateWorkOrder = async (id, workOrderData) => {
  try {
    const response = await fetch(buildApiUrl("/api/workorders/:id", { id }), {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(workOrderData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error updating work order:", error)
    throw error
  }
}

// Delete work order
export const deleteWorkOrder = async (id) => {
  try {
    const response = await fetch(buildApiUrl("/api/workorders/:id", { id }), {
      method: "DELETE",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error("Error deleting work order:", error)
    throw error
  }
}

// Get work order by ID
export const fetchWorkOrderById = async (id) => {
  try {
    const response = await fetch(buildApiUrl("/api/workorders/:id", { id }), {
      method: "GET",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching work order:", error)
    throw error
  }
}
