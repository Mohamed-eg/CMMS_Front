import { API_CONFIG, buildApiUrl, getAuthHeaders } from "../config/api"

// Fetch dashboard KPI data
export const fetchDashboardStats = async () => {
  try {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.DASHBOARD_STATS), {
      method: "GET",
      headers: getAuthHeaders(),
      timeout: API_CONFIG.TIMEOUT,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    throw error
  }
}

// Fetch recent work orders
export const fetchRecentWorkOrders = async () => {
  try {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.RECENT_WORK_ORDERS), {
      method: "GET",
      headers: getAuthHeaders(),
      timeout: API_CONFIG.TIMEOUT,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching recent work orders:", error)
    throw error
  }
}

// Fetch asset status
export const fetchAssetStatus = async () => {
  try {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ASSET_STATUS), {
      method: "GET",
      headers: getAuthHeaders(),
      timeout: API_CONFIG.TIMEOUT,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching asset status:", error)
    throw error
  }
}

// Fetch upcoming maintenance
export const fetchUpcomingMaintenance = async () => {
  try {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.UPCOMING_MAINTENANCE), {
      method: "GET",
      headers: getAuthHeaders(),
      timeout: API_CONFIG.TIMEOUT,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching upcoming maintenance:", error)
    throw error
  }
}

// Fetch quick stats
export const fetchQuickStats = async () => {
  try {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.QUICK_STATS), {
      method: "GET",
      headers: getAuthHeaders(),
      timeout: API_CONFIG.TIMEOUT,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching quick stats:", error)
    throw error
  }
}

// Fetch all dashboard data at once
export const fetchAllDashboardData = async () => {
  try {
    const [stats, workOrders, assetStatus, upcomingMaintenance, quickStats] = await Promise.all([
      fetchDashboardStats(),
      fetchRecentWorkOrders(),
      fetchAssetStatus(),
      fetchUpcomingMaintenance(),
      fetchQuickStats(),
    ])

    return {
      stats,
      workOrders,
      assetStatus,
      upcomingMaintenance,
      quickStats,
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    throw error
  }
}
