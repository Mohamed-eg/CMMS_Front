import { API_CONFIG, buildApiUrl } from "../config/api"

// Authentication API functions
const login = async (email, password) => {
  try {
    console.log("🔐 Attempting login with:", { email })

    const url = buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN)
    console.log("📡 Login URL:", url)

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    console.log("📡 Login response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.log("❌ Login error data:", errorData)

      // Handle specific error cases
      if (response.status === 404 || errorData.message?.toLowerCase().includes("email")) {
        throw new Error("Email not found in our system")
      } else if (response.status === 401 || errorData.message?.toLowerCase().includes("password")) {
        throw new Error("Incorrect password")
      } else if (response.status >= 500) {
        throw new Error("Server error. Please try again later.")
      } else {
        throw new Error(errorData.message || "Login failed")
      }
    }

    const data = await response.json()
    console.log("✅ Login successful:", { user: data.user?.email })

    return data
  } catch (error) {
    console.error("❌ Login error:", error.message)

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Unable to connect to server. Please check your internet connection.")
    }

    throw error
  }
}

const logout = async () => {
  try {
    const token = localStorage.getItem("authToken")

    if (token) {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGOUT)
      await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
    }
  } catch (error) {
    console.error("Logout error:", error)
  } finally {
    // Always clear local storage
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
  }
}

const verifyToken = async (token) => {
  try {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.VERIFY)
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Token verification failed")
    }

    return await response.json()
  } catch (error) {
    console.error("Token verification error:", error)
    throw error
  }
}

const register = async (userData) => {
  try {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER)
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Registration failed")
    }

    return await response.json()
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

const refreshToken = async () => {
  try {
    const token = localStorage.getItem("authToken")
    if (!token) {
      throw new Error("No token available")
    }

    const url = buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.REFRESH)
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Token refresh failed")
    }

    const data = await response.json()

    if (data.token) {
      localStorage.setItem("authToken", data.token)
    }

    return data
  } catch (error) {
    console.error("Token refresh error:", error)
    throw error
  }
}

// Export as authAPI object
export const authAPI = {
  login,
  logout,
  verifyToken,
  register,
  refreshToken,
}

// Also export individual functions for flexibility
export { login, logout, verifyToken, register, refreshToken }

// Default export
export default authAPI
