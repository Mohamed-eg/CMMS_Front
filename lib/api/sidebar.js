import { apiRequest } from "../config/api"

export const fetchSidebarInfo = async () => {
  try {
    const data = await apiRequest("/api/dashboard/sidebarInfo", { method: "GET" })
    return data
  } catch (error) {
    console.error("Error fetching sidebar info:", error)
    throw error
  }
} 
