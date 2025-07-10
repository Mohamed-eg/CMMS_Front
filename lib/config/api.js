// API Configuration
export const API_CONFIG = {
  // Base URL for the backend API
  BASE_URL: "https://cmms-back.vercel.app",

  // Request timeout in milliseconds
  TIMEOUT: 10000,

  // API endpoints
  ENDPOINTS: {
    // Authentication endpoints
    AUTH: {
      LOGIN: "/api/auth/login",
      LOGOUT: "/api/auth/logout",
      REFRESH: "/api/auth/refresh",
      VERIFY: "/api/auth/verify",
    },

    // Dashboard endpoints
    DASHBOARD: {
      STATS: "/api/dashboard/stats",
      RECENT_ACTIVITIES: "/api/dashboard/activities",
      ALERTS: "/api/dashboard/alerts",
    },

    // Work Orders endpoints
    WORK_ORDERS: {
      LIST: "/api/workorders",
      CREATE: "/api/workorders",
      UPDATE: "/api/workorders/:id",
      DELETE: "/api/workorders/:id",
      STATS: "/api/workorders/stats",
      SEARCH: "/api/workorders/search",
    },

    // Assets endpoints
    ASSETS: {
      LIST: "/api/assets",
      CREATE: "/api/assets",
      UPDATE: "/api/assets/:id",
      DELETE: "/api/assets/:id",
      STATS: "/api/assets/stats",
      SEARCH: "/api/assets/search",
    },

    // Users endpoints
    USERS: {
      LIST: "/api/users",
      CREATE: "/api/users",
      UPDATE: "/api/users/:id",
      DELETE: "/api/users/:id",
      STATS: "/api/users/stats",
      PROFILE: "/api/users/profile",
    },

    // Stations endpoints
    STATIONS: {
      LIST: "/api/stations",
      CREATE: "/api/stations",
      UPDATE: "/api/stations/:id",
      DELETE: "/api/stations/:id",
      STATS: "/api/stations/stats",
    },

    // Reports endpoints
    REPORTS: {
      LIST: "/api/reports",
      CREATE: "/api/reports",
      EXPORT: "/api/reports/export",
    },
  },
}

// Helper function to build complete API URLs
export const buildApiUrl = (endpoint, params = {}) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`

  // Replace URL parameters (e.g., :id with actual values)
  Object.keys(params).forEach((key) => {
    url = url.replace(`:${key}`, params[key])
  })

  return url
}

// Helper function to get authentication headers
export const getAuthHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  // Add authorization header if token exists (client-side only)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken")
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  return headers
}

// Helper function to handle API responses
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`
    throw new Error(errorMessage)
  }

  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return await response.json()
  }

  return await response.text()
}

// Generic API request function
export const apiRequest = async (url, options = {}) => {
  const config = {
    headers: getAuthHeaders(),
    signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    ...options,
  }

  try {
    const response = await fetch(url, config)
    return await handleApiResponse(response)
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timeout - please check your connection")
    }
    throw error
  }
}

// Export default configuration
export default API_CONFIG
