import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Placeholder for work orders management
export const fetchWorkOrders = createAsyncThunk("workOrders/fetchWorkOrders", async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return []
})

const workOrdersSlice = createSlice({
  name: "workOrders",
  initialState: {
    workOrders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
  },
})

export default workOrdersSlice.reducer
