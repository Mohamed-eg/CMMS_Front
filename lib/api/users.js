import { API_CONFIG, apiRequest } from "../config/api"

// Mock user data for development
const mockUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@gasstation.com",
    role: "Admin",
    department: "Management",
    phone: "+1 (555) 123-4567",
    status: "Active",
    lastLogin: "2024-01-10T10:30:00Z",
    createdAt: "2023-06-15T08:00:00Z",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@gasstation.com",
    role: "Technician",
    department: "Maintenance",
    phone: "+1 (555) 234-5678",
    status: "Active",
    lastLogin: "2024-01-10T09:15:00Z",
    createdAt: "2023-07-20T10:30:00Z",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike.wilson@gasstation.com",
    role: "Manager",
    department: "Operations",
    phone: "+1 (555) 345-6789",
    status: "Active",
    lastLogin: "2024-01-09T16:45:00Z",
    createdAt: "2023-08-10T14:20:00Z",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@gasstation.com",
    role: "Technician",
    department: "Maintenance",
    phone: "+1 (555) 456-7890",
    status: "Active",
    lastLogin: "2024-01-10T08:00:00Z",
    createdAt: "2023-09-05T11:15:00Z",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 5,
    name: "Robert Brown",
    email: "robert.brown@gasstation.com",
    role: "Operator",
    department: "Operations",
    phone: "+1 (555) 567-8901",
    status: "Inactive",
    lastLogin: "2024-01-05T12:30:00Z",
    createdAt: "2023-10-12T09:45:00Z",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 6,
    name: "Lisa Anderson",
    email: "lisa.anderson@gasstation.com",
    role: "Admin",
    department: "IT",
    phone: "+1 (555) 678-9012",
    status: "Active",
    lastLogin: "2024-01-10T11:20:00Z",
    createdAt: "2023-11-08T13:10:00Z",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 7,
    name: "David Martinez",
    email: "david.martinez@gasstation.com",
    role: "Technician",
    department: "Maintenance",
    phone: "+1 (555) 789-0123",
    status: "Active",
    lastLogin: "2024-01-10T07:45:00Z",
    createdAt: "2023-12-01T15:30:00Z",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 8,
    name: "Jennifer Taylor",
    email: "jennifer.taylor@gasstation.com",
    role: "Manager",
    department: "Management",
    phone: "+1 (555) 890-1234",
    status: "Active",
    lastLogin: "2024-01-09T14:10:00Z",
    createdAt: "2024-01-02T10:00:00Z",
    avatar: "/placeholder-user.jpg",
  },
]

// Calculate user statistics from mock data
const calculateUserStats = (users = mockUsers) => {
  const stats = {
    total: users.length,
    active: users.filter((user) => user.status === "Active").length,
    inactive: users.filter((user) => user.status === "Inactive").length,
    byRole: {},
    byDepartment: {},
    recentLogins: 0,
  }

  // Count by role
  users.forEach((user) => {
    stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1
  })

  // Count by department
  users.forEach((user) => {
    stats.byDepartment[user.department] = (stats.byDepartment[user.department] || 0) + 1
  })

  // Count recent logins (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  stats.recentLogins = users.filter((user) => new Date(user.lastLogin) > sevenDaysAgo).length

  return stats
}

// Main API functions
const getUsers = async (filters = {}) => {
  try {
    console.log("👥 Fetching users with filters:", filters)

    // Try to fetch from real API first
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.USERS.LIST, {
        method: "GET",
      })
      console.log("✅ Users fetched from API:", response)
      return response
    } catch (apiError) {
      console.log("⚠️ API unavailable, using mock data:", apiError.message)
    }

    // Fallback to mock data
    let filteredUsers = [...mockUsers]

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.role.toLowerCase().includes(searchTerm) ||
          user.department.toLowerCase().includes(searchTerm),
      )
    }

    if (filters.role) {
      filteredUsers = filteredUsers.filter((user) => user.role === filters.role)
    }

    if (filters.status) {
      filteredUsers = filteredUsers.filter((user) => user.status === filters.status)
    }

    if (filters.department) {
      filteredUsers = filteredUsers.filter((user) => user.department === filters.department)
    }

    console.log("✅ Users filtered:", filteredUsers.length)
    return {
      users: filteredUsers,
      total: filteredUsers.length,
      page: filters.page || 1,
      limit: filters.limit || 10,
    }
  } catch (error) {
    console.error("❌ Error fetching users:", error)
    throw error
  }
}

const getUserStats = async () => {
  try {
    console.log("📊 Fetching user statistics...")

    // Try to fetch from real API first
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.USERS.STATS, {
        method: "GET",
      })
      console.log("✅ User stats fetched from API:", response)
      return response
    } catch (apiError) {
      console.log("⚠️ API unavailable, calculating from mock data:", apiError.message)
    }

    // Fallback to mock data calculation
    const stats = calculateUserStats(mockUsers)
    console.log("✅ User stats calculated:", stats)
    return stats
  } catch (error) {
    console.error("❌ Error fetching user stats:", error)
    throw error
  }
}

const getUser = async (id) => {
  try {
    console.log("👤 Fetching user:", id)

    // Try to fetch from real API first
    try {
      const response = await apiRequest(`${API_CONFIG.ENDPOINTS.USERS.LIST}/${id}`, {
        method: "GET",
      })
      console.log("✅ User fetched from API:", response)
      return response
    } catch (apiError) {
      console.log("⚠️ API unavailable, using mock data:", apiError.message)
    }

    // Fallback to mock data
    const user = mockUsers.find((u) => u.id === Number.parseInt(id))
    if (!user) {
      throw new Error("User not found")
    }

    console.log("✅ User found in mock data:", user)
    return user
  } catch (error) {
    console.error("❌ Error fetching user:", error)
    throw error
  }
}

const createUser = async (userData) => {
  try {
    console.log("➕ Creating user:", userData)

    // Try to create via real API first
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.USERS.CREATE, {
        method: "POST",
        body: JSON.stringify(userData),
      })
      console.log("✅ User created via API:", response)
      return response
    } catch (apiError) {
      console.log("⚠️ API unavailable, simulating creation:", apiError.message)
    }

    // Simulate creation with mock data
    const newUser = {
      id: Math.max(...mockUsers.map((u) => u.id)) + 1,
      ...userData,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      avatar: "/placeholder-user.jpg",
    }

    mockUsers.push(newUser)
    console.log("✅ User created (simulated):", newUser)
    return newUser
  } catch (error) {
    console.error("❌ Error creating user:", error)
    throw error
  }
}

const updateUser = async (id, userData) => {
  try {
    console.log("✏️ Updating user:", id, userData)

    // Try to update via real API first
    try {
      const response = await apiRequest(`${API_CONFIG.ENDPOINTS.USERS.UPDATE}/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      })
      console.log("✅ User updated via API:", response)
      return response
    } catch (apiError) {
      console.log("⚠️ API unavailable, simulating update:", apiError.message)
    }

    // Simulate update with mock data
    const userIndex = mockUsers.findIndex((u) => u.id === Number.parseInt(id))
    if (userIndex === -1) {
      throw new Error("User not found")
    }

    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData }
    console.log("✅ User updated (simulated):", mockUsers[userIndex])
    return mockUsers[userIndex]
  } catch (error) {
    console.error("❌ Error updating user:", error)
    throw error
  }
}

const deleteUser = async (id) => {
  try {
    console.log("🗑️ Deleting user:", id)

    // Try to delete via real API first
    try {
      const response = await apiRequest(`${API_CONFIG.ENDPOINTS.USERS.DELETE}/${id}`, {
        method: "DELETE",
      })
      console.log("✅ User deleted via API:", response)
      return response
    } catch (apiError) {
      console.log("⚠️ API unavailable, simulating deletion:", apiError.message)
    }

    // Simulate deletion with mock data
    const userIndex = mockUsers.findIndex((u) => u.id === Number.parseInt(id))
    if (userIndex === -1) {
      throw new Error("User not found")
    }

    const deletedUser = mockUsers.splice(userIndex, 1)[0]
    console.log("✅ User deleted (simulated):", deletedUser)
    return { success: true, user: deletedUser }
  } catch (error) {
    console.error("❌ Error deleting user:", error)
    throw error
  }
}

const searchUsers = async (query) => {
  try {
    console.log("🔍 Searching users:", query)

    // Try to search via real API first
    try {
      const response = await apiRequest(`${API_CONFIG.ENDPOINTS.USERS.LIST}?search=${encodeURIComponent(query)}`, {
        method: "GET",
      })
      console.log("✅ Users searched via API:", response)
      return response
    } catch (apiError) {
      console.log("⚠️ API unavailable, searching mock data:", apiError.message)
    }

    // Search in mock data
    const searchTerm = query.toLowerCase()
    const results = mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm) ||
        user.department.toLowerCase().includes(searchTerm),
    )

    console.log("✅ Users found in search:", results.length)
    return { users: results, total: results.length }
  } catch (error) {
    console.error("❌ Error searching users:", error)
    throw error
  }
}

// Create users API object
export const usersAPI = {
  getUsers,
  getUserStats,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
}

// Named exports for individual functions
export { getUsers, getUserStats, getUser, createUser, updateUser, deleteUser, searchUsers }

// Alias exports for compatibility
export const fetchUsers = getUsers
export const fetchUserStats = getUserStats
export const fetchUser = getUser

// Default export
export default usersAPI
