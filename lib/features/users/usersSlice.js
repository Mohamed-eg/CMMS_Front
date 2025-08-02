import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getUsers, createUser as apiCreateUser, deleteUser as apiDeleteUser, updateUser as apiUpdateUser } from "@/lib/api/users"

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (filters = {}) => {
  const response = await getUsers(filters)
  // If the API returns { users: [...] }, use that, else fallback
  return response.users || response
})

export const addUser = createAsyncThunk("users/addUser", async (userData) => {
  const newUser = await apiCreateUser(userData)
  console.log(newUser)
 if(newUser){
  return newUser
 }
})

export const updateUser = createAsyncThunk("users/updateUser", async ({ id, userData }) => {
  const updatedUser = await apiUpdateUser(id, userData)
  return updatedUser
})

export const deleteUser = createAsyncThunk("users/deleteUser", async (userId) => {
  await apiDeleteUser(userId)
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
      if (state.searchTerm) {
        filtered = filtered.filter(
          (user) =>
            (user.name?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
              `${user.FirstName || ""} ${user.LastName || ""}`.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
              user.email?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
              user.Email?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
              user.id?.toLowerCase().includes(state.searchTerm.toLowerCase())
            )
        )
      }
      if (state.roleFilter !== "All") {
        filtered = filtered.filter((user) => user.role === state.roleFilter || user.Role === state.roleFilter)
      }
      if (state.technicianTypeFilter !== "All" && state.roleFilter === "Technician") {
        filtered = filtered.filter((user) => user.technicianType === state.technicianTypeFilter)
      }
      if (state.statusFilter !== "All") {
        filtered = filtered.filter((user) => user.status === state.statusFilter || user.Status === state.statusFilter)
      }
      state.filteredUsers = filtered
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(updateUser.pending, (state) => {
        state.loading = true
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false
        const index = state.users.findIndex((user) => user.id === action.payload.id || user._id === action.payload._id)
        if (index !== -1) {
          state.users[index] = action.payload
          usersSlice.caseReducers.applyFilters(state)
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload && user._id !== action.payload)
        usersSlice.caseReducers.applyFilters(state)
      })
  },
})

export const { setSearchTerm, setRoleFilter, setTechnicianTypeFilter, setStatusFilter, clearFilters } = usersSlice.actions
export default usersSlice.reducer
