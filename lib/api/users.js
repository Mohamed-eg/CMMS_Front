import { API_CONFIG, buildApiUrl, getAuthHeaders, handleApiResponse } from "../config/api"

// Get all users with optional filters
export const getUsers = async (filters = {}) => {
  try {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.USERS)
    const queryParams = new URLSearchParams()

    // Add filters as query parameters
    if (filters.role) queryParams.append("role", filters.role)
    if (filters.status) queryParams.append("status", filters.status)
    if (filters.search) queryParams.append("search", filters.search)

    const fullUrl = queryParams.toString() ? `${url}?${queryParams}` : url

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

// Get user statistics
export const getUserStats = async () => {
  try {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.USERS_STATS)

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error("Error fetching user stats:", error)
    throw error
  }
}

// Create a new user
export const createUser = async (userData) => {
  try {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.USERS)

    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

// Update a user
export const updateUser = async (id, userData) => {
  try {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.USERS}/${id}`)

    const response = await fetch(url, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

// Delete a user
export const deleteUser = async (id) => {
  try {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.USERS}/${id}`)

    const response = await fetch(url, {
      method: "DELETE",
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}

// Get a single user by ID
export const getUser = async (id) => {
  try {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.USERS}/${id}`)

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}
