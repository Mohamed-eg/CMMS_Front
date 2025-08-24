import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchDashboardSummary } from "../../api/dashboard"

export const loadDashboardSummary = createAsyncThunk("dashboard/loadSummary", async () => {
  const data = await fetchDashboardSummary()
  // Expecting { stats: { total, inProgress, pending, overdue }, last5WorkOrders: [...], assetsSummary: {...} }
  return data
})

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: { total: 0, inProgress: 0, pending: 0, overdue: 0 },
    last5WorkOrders: [],
    assetsSummary: { perCategory: [], totals: { totalAssets: 0, activeAssets: 0 } },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDashboardSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadDashboardSummary.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload?.stats || state.stats
        state.last5WorkOrders = action.payload?.last5WorkOrders || []
        state.assetsSummary = action.payload?.assetsSummary || state.assetsSummary
      })
      .addCase(loadDashboardSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const selectDashboardStats = (state) => state.dashboard.stats
export const selectDashboardRecentWorkOrders = (state) => state.dashboard.last5WorkOrders
export const selectDashboardAssetsSummary = (state) => state.dashboard.assetsSummary
export const selectDashboardLoading = (state) => state.dashboard.loading
export const selectDashboardError = (state) => state.dashboard.error

export default dashboardSlice.reducer 