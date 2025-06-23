import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Mock API calls - replace with actual API calls
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return [
    {
      id: "USR-001",
      name: "Mohammed Al-Fahad",
      email: "mohammed.fahad@gasstation.sa",
      phone: "+966 55 234 5678",
      role: "Technician",
      technicianType: "Electrician",
      status: "Active",
      department: "Maintenance",
      skills: ["Electrical Systems", "Panel Wiring"],
      certifications: ["Electrical Safety", "High Voltage"],
      joinDate: "2023-01-15",
      lastLogin: "2024-01-20 09:30",
    },
    {
      id: "USR-002",
      name: "Ahmed Al-Rashid",
      email: "ahmed.rashid@gasstation.sa",
      phone: "+966 50 345 6789",
      role: "Technician",
      technicianType: "Pump Maintenance Tech",
      status: "Active",
      department: "Operations",
      skills: ["Pump Calibration", "Flow Meters"],
      certifications: ["Pump Maintenance", "Safety Protocols"],
      joinDate: "2023-03-20",
      lastLogin: "2024-01-20 08:15",
    },
    {
      id: "USR-003",
      name: "Khalid Al-Mutairi",
      email: "khalid.mutairi@gasstation.sa",
      phone: "+966 56 456 7890",
      role: "Manager",
      technicianType: null,
      status: "Active",
      department: "Operations",
      skills: ["Team Management", "Operations Planning"],
      certifications: ["Management", "Safety Leadership"],
      joinDate: "2022-08-10",
      lastLogin: "2024-01-20 07:45",
    },
    {
      id: "USR-004",
      name: "Omar Al-Zahra",
      email: "omar.zahra@gasstation.sa",
      phone: "+966 54 567 8901",
      role: "Technician",
      technicianType: "General Plumbing Tech",
      status: "Active",
      department: "Maintenance",
      skills: ["Plumbing Systems", "Water Lines"],
      certifications: ["Plumbing", "Water Safety"],
      joinDate: "2023-06-05",
      lastLogin: "2024-01-19 16:20",
    },
    {
      id: "USR-005",
      name: "Faisal Al-Dosari",
      email: "faisal.dosari@gasstation.sa",
      phone: "+966 53 678 9012",
      role: "Admin",
      technicianType: null,
      status: "Active",
      department: "IT",
      skills: ["System Administration", "Network Management"],
      certifications: ["IT Security", "Network Admin"],
      joinDate: "2022-11-15",
      lastLogin: "2024-01-20 10:00",
    },
    {
      id: "USR-006",
      name: "Saad Al-Harbi",
      email: "saad.harbi@gasstation.sa",
      phone: "+966 52 789 0123",
      role: "Technician",
      technicianType: "Extension Tech",
      status: "Inactive",
      department: "Maintenance",
      skills: ["System Extensions", "Infrastructure"],
      certifications: ["Installation", "Safety Protocols"],
      joinDate: "2023-09-12",
      lastLogin: "2024-01-18 14:30",
    },
  ]
})

export const addUser = createAsyncThunk("users/addUser", async (userData) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    ...userData,
    id: `USR-${Date.now()}`,
    joinDate: new Date().toISOString().split("T")[0],
    lastLogin: "Never",
  }
})

export const updateUser = createAsyncThunk("users/updateUser", async ({ id, userData }) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { id, ...userData }
})

export const deleteUser = createAsyncThunk("users/deleteUser", async (userId) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return userId
})

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    filteredUsers: [],
    loading: false,
    error: null,
    searchTerm: "",
    roleFilter: "All",
    technicianTypeFilter: "All",
    statusFilter: "All",
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
      usersSlice.caseReducers.applyFilters(state)
    },
    setRoleFilter: (state, action) => {
      state.roleFilter = action.payload
      // Reset technician type filter when role changes
      if (action.payload !== "Technician") {
        state.technicianTypeFilter = "All"
      }
      usersSlice.caseReducers.applyFilters(state)
    },
    setTechnicianTypeFilter: (state, action) => {
      state.technicianTypeFilter = action.payload
      usersSlice.caseReducers.applyFilters(state)
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload
      usersSlice.caseReducers.applyFilters(state)
    },
    clearFilters: (state) => {
      state.searchTerm = ""
      state.roleFilter = "All"
      state.technicianTypeFilter = "All"
      state.statusFilter = "All"
      state.filteredUsers = state.users
    },
    applyFilters: (state) => {
      let filtered = state.users

      // Apply search filter
      if (state.searchTerm) {
        filtered = filtered.filter(
          (user) =>
            user.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            user.id.toLowerCase().includes(state.searchTerm.toLowerCase()),
        )
      }

      // Apply role filter
      if (state.roleFilter !== "All") {
        filtered = filtered.filter((user) => user.role === state.roleFilter)
      }

      // Apply technician type filter
      if (state.technicianTypeFilter !== "All" && state.roleFilter === "Technician") {
        filtered = filtered.filter((user) => user.technicianType === state.technicianTypeFilter)
      }

      // Apply status filter
      if (state.statusFilter !== "All") {
        filtered = filtered.filter((user) => user.status === state.statusFilter)
      }

      state.filteredUsers = filtered
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
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user.id === action.payload.id)
        if (index !== -1) {
          state.users[index] = action.payload
          usersSlice.caseReducers.applyFilters(state)
        }
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload)
        usersSlice.caseReducers.applyFilters(state)
      })
  },
})

export const { setSearchTerm, setRoleFilter, setTechnicianTypeFilter, setStatusFilter, clearFilters } =
  usersSlice.actions

export default usersSlice.reducer
