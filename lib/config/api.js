// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://cmms-back.vercel.app",
  TIMEOUT: 10000, // 10 seconds
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/auth/login",
      LOGOUT: "/api/auth/logout",
      VERIFY: "/api/auth/verify",
      REGISTER: "/api/auth/register",
      REFRESH: "/api/auth/refresh",
    },
    USERS: {
      LIST: "/api/users",
      CREATE: "/api/users",
      UPDATE: "/api/users",
      DELETE: "/api/users",
      PROFILE: "/api/users/profile",
      STATS: "/api/users/stats",
    },
    ASSETS: {
      LIST: "/api/assets",
      CREATE: "/api/assets",
      UPDATE: "/api/assets",
      DELETE: "/api/assets",
      SEARCH: "/api/assets/search",
      STATS: "/api/assets/stats",
    },
    STATIONS: {
      LIST: "/api/stations",
      CREATE: "/api/stations",
      UPDATE: "/api/stations",
      DELETE: "/api/stations",
      DETAILS: "/api/stations",
    },
    WORK_ORDERS: {
      LIST: "/api/workorders",
      CREATE: "/api/workorders",
      UPDATE: "/api/workorders",
      DELETE: "/api/workorders",
      STATS: "/api/workorders/stats",
    },
    DASHBOARD: {
      LIST: "/api/dashboard",
      STATS: "/api/dashboard/stats",
      RECENT_ACTIVITY: "/api/dashboard/recent-activity",
      ALERTS: "/api/dashboard/alerts",
    },
    REPORTS: {
      LIST: "/api/reports",
      GENERATE: "/api/reports/generate",
      DOWNLOAD: "/api/reports/download",
    },
  },
}

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, "") // Remove trailing slash
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  return `${baseUrl}${cleanEndpoint}`
}

// Helper function to get authentication headers
export const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Helper function to handle API responses
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }
  if (response.status === 204) {
    return null // No content
  }
  if (response.status === 201) {
    console.log("Resource created successfully" + response)
  }
  return response.json()
}

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint)
  const config = {
    headers: getAuthHeaders(),
    timeout: API_CONFIG.TIMEOUT,
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return await handleApiResponse(response)
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timeout")
    }
    throw error
  }
}

// Export default configuration
export default API_CONFIG
