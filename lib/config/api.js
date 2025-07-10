// API Configuration
export const API_CONFIG = {
  BASE_URL: "https://cmms-back.vercel.app",
  TIMEOUT: 10000, // 10 seconds
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    VERIFY: "/api/auth/verify",

    // Dashboard endpoints
    DASHBOARD_STATS: "/api/dashboard/stats",
    DASHBOARD_RECENT_WORK_ORDERS: "/api/dashboard/recent-work-orders",
    DASHBOARD_ALERTS: "/api/dashboard/alerts",
    DASHBOARD_MAINTENANCE_SCHEDULE: "/api/dashboard/maintenance-schedule",

    // Work Orders endpoints
    WORK_ORDERS: "/api/workorders",
    WORK_ORDERS_STATS: "/api/workorders/stats",

    // Assets endpoints
    ASSETS: "/api/assets",
    ASSETS_STATS: "/api/assets/stats",

    // Users endpoints
    USERS: "/api/users",
    USERS_STATS: "/api/users/stats",

    // Stations endpoints
    STATIONS: "/api/stations",
    STATIONS_STATS: "/api/stations/stats",
  },
}

// Helper function to build API URLs
export const buildApiUrl = (endpoint, params = {}) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`

  // Replace URL parameters (e.g., :id with actual id)
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

  // Only add auth header if we're in the browser and have a token
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
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

// Helper function to make authenticated API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint)
  const headers = getAuthHeaders()

  const config = {
    headers,
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    return await handleApiResponse(response)
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error)
    throw error
  }
}
