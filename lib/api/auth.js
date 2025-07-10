import { API_CONFIG, buildApiUrl, getAuthHeaders, handleApiResponse } from "../config/api"

// Authentication API object
export const authAPI = {
  // Login function
  login: async (email, password) => {
    try {
      console.log("🔐 Attempting login for:", email)

      const url = buildApiUrl(API_CONFIG.ENDPOINTS.LOGIN)

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
      })

      console.log("📡 Login response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.log("❌ Login error data:", errorData)

        // Handle specific error cases
        if (response.status === 404 || errorData.message?.includes("not found")) {
          throw new Error("Email not found in our system")
        } else if (response.status === 401 || errorData.message?.includes("password")) {
          throw new Error("Incorrect password")
        } else if (response.status >= 500) {
          throw new Error("Server error. Please try again later.")
        } else {
          throw new Error(errorData.message || "Login failed")
        }
      }

      const data = await response.json()
      console.log("✅ Login successful:", data)

      return data
    } catch (error) {
      console.error("❌ Login error:", error)

      if (error.name === "AbortError") {
        throw new Error("Request timeout. Please check your connection.")
      }

      throw error
    }
  },

  // Logout function
  logout: async () => {
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.LOGOUT)

      const response = await fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
      })

      // Clear local storage regardless of response
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
      }

      return await handleApiResponse(response)
    } catch (error) {
      console.error("Error during logout:", error)
      // Still clear local storage even if API call fails
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
      }
      throw error
    }
  },

  // Verify token function
  verifyToken: async (token) => {
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.VERIFY)

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
      })

      return await handleApiResponse(response)
    } catch (error) {
      console.error("Error verifying token:", error)
      throw error
    }
  },

  // Get current user info
  getCurrentUser: () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user")
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken")
      return !!token
    }
    return false
  },
}
