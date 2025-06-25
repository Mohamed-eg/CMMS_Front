import { buildApiUrl, getAuthHeaders } from "../config/api"

// Fetch all users
export const fetchUsers = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams()

    // Add filters to query params
    if (filters.role && filters.role !== "all") {
      queryParams.append("role", filters.role)
    }
    if (filters.status && filters.status !== "all") {
      queryParams.append("status", filters.status)
    }
    if (filters.search) {
      queryParams.append("search", filters.search)
    }

    const url = buildApiUrl("/api/users") + (queryParams.toString() ? `?${queryParams.toString()}` : "")

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
    console.error("Error fetching users:", error)
    throw error
  }
}

// Create new user
export const createUser = async (userData) => {
  try {
    const response = await fetch(buildApiUrl("/api/users"), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

// Update user
export const updateUser = async (id, userData) => {
  try {
    const response = await fetch(buildApiUrl("/api/users/:id", { id }), {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

// Delete user
export const deleteUser = async (id) => {
  try {
    const response = await fetch(buildApiUrl("/api/users/:id", { id }), {
      method: "DELETE",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}

// Get user by ID
export const fetchUserById = async (id) => {
  try {
    const response = await fetch(buildApiUrl("/api/users/:id", { id }), {
      method: "GET",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}

// Get current user profile
export const fetchUserProfile = async () => {
  try {
    const response = await fetch(buildApiUrl("/api/users/profile"), {
      method: "GET",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await fetch(buildApiUrl("/api/users/profile"), {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

// Fetch user statistics
export const fetchUserStats = async () => {
  try {
    const response = await fetch(buildApiUrl("/api/users/stats"), {
      method: "GET",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching user stats:", error)
    throw error
  }
}
