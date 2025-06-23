import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  reports: [],
  loading: false,
  error: null,
}

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    // Reports reducers will be implemented here
  },
})

export default reportsSlice.reducer
