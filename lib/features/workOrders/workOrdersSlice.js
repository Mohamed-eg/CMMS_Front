import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Mock data for work orders
const mockWorkOrders = [
  {
    id: "WO-001",
    equipmentId: "DISP-001",
    stationName: "Al-Noor Gas Station - Riyadh",
    description: "Fuel dispenser not responding to card payments",
    priority: "high",
    urgency: "immediate",
    status: "pending",
    submittedAt: "2024-01-15T10:30:00Z",
    submittedBy: "Ahmed Al-Rashid",
    photos: [],
  },
]

// Async thunk for fetching work orders
export const fetchWorkOrders = createAsyncThunk("workOrders/fetchWorkOrders", async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockWorkOrders
})

// Async thunk for submitting new work order
export const submitWorkOrder = createAsyncThunk("workOrders/submitWorkOrder", async (workOrderData) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Create new work order with generated ID
  const newWorkOrder = {
    ...workOrderData,
    id: `WO-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: "pending",
  }

  return newWorkOrder
})

// Async thunk for updating work order
export const updateWorkOrder = createAsyncThunk("workOrders/updateWorkOrder", async ({ id, updates }) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return { id, updates }
})

// Async thunk for deleting work order
export const deleteWorkOrder = createAsyncThunk("workOrders/deleteWorkOrder", async (workOrderId) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800))

  return workOrderId
})

const workOrdersSlice = createSlice({
  name: "workOrders",
  initialState: {
    workOrders: [],
    loading: false,
    submitting: false,
    error: null,
    filters: {
      status: "all",
      priority: "all",
      station: "all",
      search: "",
    },
  },
  reducers: {
    // Synchronous actions
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        status: "all",
        priority: "all",
        station: "all",
        search: "",
      }
    },
    updateWorkOrderStatus: (state, action) => {
      const { id, status } = action.payload
      const workOrder = state.workOrders.find((wo) => wo.id === id)
      if (workOrder) {
        workOrder.status = status
        workOrder.updatedAt = new Date().toISOString()
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch work orders
      .addCase(fetchWorkOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWorkOrders.fulfilled, (state, action) => {
        state.loading = false
        state.workOrders = action.payload
      })
      .addCase(fetchWorkOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // Submit work order
      .addCase(submitWorkOrder.pending, (state) => {
        state.submitting = true
        state.error = null
      })
      .addCase(submitWorkOrder.fulfilled, (state, action) => {
        state.submitting = false
        state.workOrders.unshift(action.payload) // Add to beginning of array
      })
      .addCase(submitWorkOrder.rejected, (state, action) => {
        state.submitting = false
        state.error = action.error.message
      })

      // Update work order
      .addCase(updateWorkOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateWorkOrder.fulfilled, (state, action) => {
        state.loading = false
        const { id, updates } = action.payload
        const index = state.workOrders.findIndex((wo) => wo.id === id)
        if (index !== -1) {
          state.workOrders[index] = { ...state.workOrders[index], ...updates }
        }
      })
      .addCase(updateWorkOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // Delete work order
      .addCase(deleteWorkOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteWorkOrder.fulfilled, (state, action) => {
        state.loading = false
        state.workOrders = state.workOrders.filter((wo) => wo.id !== action.payload)
      })
      .addCase(deleteWorkOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

// Export actions
export const { setFilters, clearFilters, updateWorkOrderStatus } = workOrdersSlice.actions

// Selectors
export const selectWorkOrders = (state) => state.workOrders.workOrders
export const selectWorkOrdersLoading = (state) => state.workOrders.loading
export const selectWorkOrdersSubmitting = (state) => state.workOrders.submitting
export const selectWorkOrdersError = (state) => state.workOrders.error
export const selectWorkOrdersFilters = (state) => state.workOrders.filters

// Filtered work orders selector
export const selectFilteredWorkOrders = (state) => {
  const { workOrders, filters } = state.workOrders

  return workOrders.filter((workOrder) => {
    // Status filter
    if (filters.status !== "all" && workOrder.status !== filters.status) {
      return false
    }

    // Priority filter
    if (filters.priority !== "all" && workOrder.priority !== filters.priority) {
      return false
    }

    // Station filter
    if (filters.station !== "all" && workOrder.stationName !== filters.station) {
      return false
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesSearch =
        workOrder.id.toLowerCase().includes(searchLower) ||
        workOrder.description.toLowerCase().includes(searchLower) ||
        workOrder.equipmentId.toLowerCase().includes(searchLower) ||
        workOrder.stationName.toLowerCase().includes(searchLower)

      if (!matchesSearch) {
        return false
      }
    }

    return true
  })
}

export default workOrdersSlice.reducer
