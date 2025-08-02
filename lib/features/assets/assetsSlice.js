import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getAssets, createAsset, updateAsset, deleteAsset, getAssetStats } from "@/lib/api/assets"

// Async thunks
export const fetchAssets = createAsyncThunk("assets/fetchAssets", async (filters = {}) => {
  const response = await getAssets(filters)
  return response.assets || []
})

export const fetchAssetStats = createAsyncThunk("assets/fetchAssetStats", async () => {
  const stats = await getAssetStats()
  return stats
})

export const createNewAsset = createAsyncThunk("assets/createAsset", async (assetData) => {
  const newAsset = await createAsset(assetData)
  return newAsset
})

export const updateExistingAsset = createAsyncThunk("assets/updateAsset", async ({ id, assetData }) => {
  const updatedAsset = await updateAsset(id, assetData)
  return updatedAsset
})

export const deleteExistingAsset = createAsyncThunk("assets/deleteAsset", async (assetId) => {
  await deleteAsset(assetId)
  return assetId
})

const assetsSlice = createSlice({
  name: "assets",
  initialState: {
    assets: [],
    stats: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch assets
      .addCase(fetchAssets.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.loading = false
        state.assets = action.payload
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Fetch stats
      .addCase(fetchAssetStats.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAssetStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
      })
      .addCase(fetchAssetStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Create asset
      .addCase(createNewAsset.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createNewAsset.fulfilled, (state, action) => {
        state.loading = false
        state.assets.push(action.payload)
      })
      .addCase(createNewAsset.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Update asset
      .addCase(updateExistingAsset.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateExistingAsset.fulfilled, (state, action) => {
        state.loading = false
        const index = state.assets.findIndex(asset => asset.id === action.payload.id)
        if (index !== -1) {
          state.assets[index] = action.payload
        }
      })
      .addCase(updateExistingAsset.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Delete asset
      .addCase(deleteExistingAsset.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteExistingAsset.fulfilled, (state, action) => {
        state.loading = false
        state.assets = state.assets.filter(asset => asset.id !== action.payload)
      })
      .addCase(deleteExistingAsset.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { clearError } = assetsSlice.actions
export default assetsSlice.reducer
