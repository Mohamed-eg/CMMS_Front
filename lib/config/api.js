// API Configuration
export const API_CONFIG = {
  BASE_URL:  process.env.NEXT_PUBLIC_API_BASE_URL || "https://cmms-back.vercel.app" || "http://localhost:5002",
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
      UPDATE: "/api/users/{id}",
      DELETE: "/api/users/{id}",
      BY_ID: "/api/users/{id}",
      PROFILE: "/api/users/profile",
      STATS: "/api/users/stats",
    },
    ASSETS: {
      LIST: "/api/assets/",
      CREATE: "/api/assets/",
      UPDATE: "/api/assets/{id}",
      DELETE: "/api/assets/{id}",
      BY_ID: "/api/assets/{id}",
      SEARCH: "/api/assets/search",
      STATS: "/api/assets/stats",
    },
    STATIONS: {
      LIST: "/api/stations",
      CREATE: "/api/stations",
      UPDATE: "/api/stations/{id}",
      DELETE: "/api/stations/{id}",
      BY_ID: "/api/stations/{id}",
      DETAILS: "/api/stations/{id}",
    },
    WORK_ORDERS: {
      LIST: "/api/workorders",
      CREATE: "/api/workorders",
      UPDATE: "/api/workorders/{id}",
      DELETE: "/api/workorders/{id}",
      BY_ID: "/api/workorders/{id}",
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
export const buildApiUrl = (endpoint, params = {}) => {
  // If endpoint is already a full URL, return it as is
  console.log(endpoint)
  if (/^https?:\/\//.test(endpoint)) {
    return endpoint;
  }
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, "");
  if(endpoint.includes("{id}")){
    endpoint = endpoint .replace(/{[^}]+}/g, '').replace(/\/{2,}/g, '/');      // remove any placeholder like {id} then Replace double slashes (//) with single /
    console.log(endpoint)
  }
  let cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  Object.entries(params).forEach(([key, value]) => {
    cleanEndpoint = cleanEndpoint.replace(`{${key}}`, value);
  });
  return `${baseUrl}${cleanEndpoint}`;
};

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
  if (response.status === 200) {
    console.log("Resource fetched successfully" + response)
  }
  return response.json()
}

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint)
  console.log("🔍 EndPointURL:", url)
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
