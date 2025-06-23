import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { stationsApi } from "../../api/stations"

// Async thunks for API calls
export const fetchStations = createAsyncThunk("stations/fetchStations", async (_, { rejectWithValue }) => {
  try {
    const response = await stationsApi.getAllStations()
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch stations")
  }
})

export const fetchStationDetails = createAsyncThunk(
  "stations/fetchStationDetails",
  async (stationId, { rejectWithValue }) => {
    try {
      const [stationInfo, equipment, utilities, safety, photos] = await Promise.all([
        stationsApi.getStationById(stationId),
        stationsApi.getStationEquipment(stationId),
        stationsApi.getStationUtilities(stationId),
        stationsApi.getStationSafety(stationId),
        stationsApi.getStationPhotos(stationId),
      ])

      return {
        stationInfo,
        equipment,
        utilities,
        safety,
        photos,
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch station details")
    }
  },
)

export const uploadStationPhoto = createAsyncThunk(
  "stations/uploadPhoto",
  async ({ stationId, photoData }, { rejectWithValue }) => {
    try {
      const response = await stationsApi.uploadStationPhoto(stationId, photoData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to upload photo")
    }
  },
)

const initialState = {
  stations: [],
  selectedStation: null,
  stationDetails: {
    stationInfo: null,
    equipment: [],
    utilities: [],
    safety: [],
    photos: [],
    layoutAreas: [],
  },
  loading: {
    stations: false,
    details: false,
    upload: false,
  },
  error: {
    stations: null,
    details: null,
    upload: null,
  },
}

const stationsSlice = createSlice({
  name: "stations",
  initialState,
  reducers: {
    setSelectedStation: (state, action) => {
      state.selectedStation = action.payload
    },
    clearStationDetails: (state) => {
      state.stationDetails = initialState.stationDetails
    },
    clearErrors: (state) => {
      state.error = initialState.error
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch stations
      .addCase(fetchStations.pending, (state) => {
        state.loading.stations = true
        state.error.stations = null
      })
      .addCase(fetchStations.fulfilled, (state, action) => {
        state.loading.stations = false
        state.stations = action.payload
      })
      .addCase(fetchStations.rejected, (state, action) => {
        state.loading.stations = false
        state.error.stations = action.payload
      })

      // Fetch station details
      .addCase(fetchStationDetails.pending, (state) => {
        state.loading.details = true
        state.error.details = null
      })
      .addCase(fetchStationDetails.fulfilled, (state, action) => {
        state.loading.details = false
        state.stationDetails = action.payload
      })
      .addCase(fetchStationDetails.rejected, (state, action) => {
        state.loading.details = false
        state.error.details = action.payload
      })

      // Upload photo
      .addCase(uploadStationPhoto.pending, (state) => {
        state.loading.upload = true
        state.error.upload = null
      })
      .addCase(uploadStationPhoto.fulfilled, (state, action) => {
        state.loading.upload = false
        state.stationDetails.photos.push(action.payload)
      })
      .addCase(uploadStationPhoto.rejected, (state, action) => {
        state.loading.upload = false
        state.error.upload = action.payload
      })
  },
})

export const { setSelectedStation, clearStationDetails, clearErrors } = stationsSlice.actions
export default stationsSlice.reducer
