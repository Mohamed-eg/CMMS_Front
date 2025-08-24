import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchSidebarInfo } from "../../api/sidebar"

const initialState = {
  totalWorkOrders: 0,
  totalAssets: 0,
  assignedWorkOrders: 0,
  loading: false,
  error: null
}

export const loadSidebarInfo = createAsyncThunk(
  "sidebar/loadSidebarInfo",
  async () => {
    const data = await fetchSidebarInfo()
    console.log(data)
    return data
  }
)

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSidebarInfo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadSidebarInfo.fulfilled, (state, action) => {
        state.loading = false
        state.totalWorkOrders = action.payload.totalWorkOrders || 0
        state.totalAssets = action.payload.totalAssets || 0
        state.assignedWorkOrders = action.payload.stationWorkOrders || 0
      })
      .addCase(loadSidebarInfo.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

export default sidebarSlice.reducer

// Selectors
export const selectSidebarInfo = (state) => state.sidebar
export const selectTotalWorkOrders = (state) => state.sidebar.totalWorkOrders
export const selectTotalAssets = (state) => state.sidebar.totalAssets
export const selectAssignedWorkOrders = (state) => state.sidebar.assignedWorkOrders
export const selectSidebarLoading = (state) => state.sidebar.loading
export const selectSidebarError = (state) => state.sidebar.error 