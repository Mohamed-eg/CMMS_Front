export const API_CONFIG = {
  BASE_URL: "https://cmms-back.vercel.app",
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    VERIFY: "/api/auth/verify",

    // Dashboard endpoints
    DASHBOARD_STATS: "/api/dashboard/stats",
    DASHBOARD_RECENT_WORK_ORDERS: "/api/dashboard/recent-work-orders",
    DASHBOARD_ALERTS: "/api/dashboard/alerts",

    // Other endpoints
    STATIONS: "/api/stations",
    WORK_ORDERS: "/api/workorders",
    ASSETS: "/api/assets",
    USERS: "/api/users",
  },

  // Request timeout in milliseconds
  TIMEOUT: 10000,

  // Default headers
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },
}
