import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Mock API calls
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    {
      id: "USR-001",
      name: "Ahmed Al-Rashid",
      email: "ahmed.rashid@gasstation.sa",
      phone: "+966 50 123 4567",
      role: "Admin",
      technicianType: null,
      status: "Active",
      lastLogin: "2024-01-15 09:30",
      joinDate: "2023-01-15",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Management",
      skills: ["Leadership", "Operations Management"],
      certifications: ["Safety Management", "Operations Oversight"],
    },
    {
      id: "USR-002",
      name: "Mohammed Al-Fahad",
      email: "mohammed.fahad@gasstation.sa",
      phone: "+966 55 234 5678",
      role: "Technician",
      technicianType: "Electrician",
      status: "Active",
      lastLogin: "2024-01-15 08:45",
      joinDate: "2023-03-20",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Maintenance",
      skills: ["Electrical Systems", "Panel Wiring", "Motor Control"],
      certifications: ["Electrical Safety", "High Voltage Systems"],
    },
    {
      id: "USR-003",
      name: "Abdullah Al-Rashid",
      email: "abdullah.rashid@gasstation.sa",
      phone: "+966 56 345 6789",
      role: "Manager",
      technicianType: null,
      status: "Active",
      lastLogin: "2024-01-14 16:20",
      joinDate: "2023-02-10",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Operations",
      skills: ["Team Management", "Quality Control"],
      certifications: ["Management Certification", "Safety Leadership"],
    },
    {
      id: "USR-004",
      name: "Khalid Al-Mutairi",
      email: "khalid.mutairi@gasstation.sa",
      phone: "+966 54 456 7890",
      role: "Technician",
      technicianType: "Pump Maintenance Tech",
      status: "Active",
      lastLogin: "2024-01-15 07:15",
      joinDate: "2023-05-12",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Maintenance",
      skills: ["Fuel Dispensers", "Pump Calibration", "Flow Meters"],
      certifications: ["Pump Systems", "Fuel Handling Safety"],
    },
    {
      id: "USR-005",
      name: "Omar Al-Zahra",
      email: "omar.zahra@gasstation.sa",
      phone: "+966 53 567 8901",
      role: "Technician",
      technicianType: "General Plumbing Tech",
      status: "Inactive",
      lastLogin: "2024-01-10 14:30",
      joinDate: "2023-08-05",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Maintenance",
      skills: ["Plumbing Systems", "Water Lines", "Drainage"],
      certifications: ["Plumbing License", "Water Safety"],
    },
    {
      id: "USR-006",
      name: "Faisal Al-Khalid",
      email: "faisal.khalid@gasstation.sa",
      phone: "+966 52 678 9012",
      role: "Technician",
      technicianType: "Extension Tech",
      status: "Active",
      lastLogin: "2024-01-14 11:20",
      joinDate: "2023-06-15",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Maintenance",
      skills: ["System Extensions", "Infrastructure", "Installation"],
      certifications: ["Installation Specialist", "System Integration"],
    },
    {
      id: "USR-007",
      name: "Nasser Al-Salem",
      email: "nasser.salem@gasstation.sa",
      phone: "+966 51 789 0123",
      role: "Technician",
      technicianType: "Electrician",
      status: "Active",
      lastLogin: "2024-01-15 06:45",
      joinDate: "2023-09-10",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Maintenance",
      skills: ["Lighting Systems", "Power Distribution", "Emergency Systems"],
      certifications: ["Electrical License", "Emergency Systems"],
    },
  ]
})

export const addUser = createAsyncThunk("users/addUser", async (userData) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300))
  return {
    ...userData,
    id: `USR-${String(Date.now()).slice(-3)}`,
    lastLogin: null,
    joinDate: new Date().toISOString().split("T")[0],
    avatar: "/placeholder.svg?height=40&width=40",
  }
})

export const updateUser = createAsyncThunk("users/updateUser", async ({ id, userData }) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { id, userData }
})

export const deleteUser = createAsyncThunk("users/deleteUser", async (userId) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300))
  return userId
})

const initialState = {
  users: [],
  filteredUsers: [],
  loading: false,
  error: null,
  filters: {
    searchTerm: "",
    roleFilter: "all",
    technicianTypeFilter: "all",
    statusFilter: "all",
  },
  selectedUser: null,
  showAddDialog: false,
  showEditDialog: false,
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.filters.searchTerm = action.payload
      usersSlice.caseReducers.applyFilters(state)
    },
    setRoleFilter: (state, action) => {
      state.filters.roleFilter = action.payload
      // Reset technician type filter when role changes
      if (action.payload !== "Technician") {
        state.filters.technicianTypeFilter = "all"
      }
      usersSlice.caseReducers.applyFilters(state)
    },
    setTechnicianTypeFilter: (state, action) => {
      state.filters.technicianTypeFilter = action.payload
      usersSlice.caseReducers.applyFilters(state)
    },
    setStatusFilter: (state, action) => {
      state.filters.statusFilter = action.payload
      usersSlice.caseReducers.applyFilters(state)
    },
    applyFilters: (state) => {
      let filtered = state.users

      // Search filter
      if (state.filters.searchTerm) {
        const searchLower = state.filters.searchTerm.toLowerCase()
        filtered = filtered.filter(
          (user) =>
            user.name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.id.toLowerCase().includes(searchLower),
        )
      }

      // Role filter
      if (state.filters.roleFilter !== "all") {
        filtered = filtered.filter((user) => user.role === state.filters.roleFilter)
      }

      // Technician type filter
      if (state.filters.technicianTypeFilter !== "all") {
        filtered = filtered.filter((user) => user.technicianType === state.filters.technicianTypeFilter)
      }

      // Status filter
      if (state.filters.statusFilter !== "all") {
        filtered = filtered.filter((user) => user.status === state.filters.statusFilter)
      }

      state.filteredUsers = filtered
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload
    },
    setShowAddDialog: (state, action) => {
      state.showAddDialog = action.payload
    },
    setShowEditDialog: (state, action) => {
      state.showEditDialog = action.payload
    },
    clearFilters: (state) => {
      state.filters = {
        searchTerm: "",
        roleFilter: "all",
        technicianTypeFilter: "all",
        statusFilter: "all",
      }
      state.filteredUsers = state.users
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
        state.filteredUsers = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Add user
      .addCase(addUser.pending, (state) => {
        state.loading = true
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false
        state.users.push(action.payload)
        usersSlice.caseReducers.applyFilters(state)
        state.showAddDialog = false
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const { id, userData } = action.payload
        const index = state.users.findIndex((user) => user.id === id)
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...userData }
          usersSlice.caseReducers.applyFilters(state)
        }
        state.showEditDialog = false
        state.selectedUser = null
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload)
        usersSlice.caseReducers.applyFilters(state)
      })
  },
})

export const {
  setSearchTerm,
  setRoleFilter,
  setTechnicianTypeFilter,
  setStatusFilter,
  applyFilters,
  setSelectedUser,
  setShowAddDialog,
  setShowEditDialog,
  clearFilters,
} = usersSlice.actions

export default usersSlice.reducer
