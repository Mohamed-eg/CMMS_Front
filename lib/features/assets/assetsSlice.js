import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  assets: [],
  loading: false,
  error: null,
  filters: {
    searchTerm: "",
    categoryFilter: "all",
    statusFilter: "all",
  },
}

const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    // Asset reducers will be implemented here
  },
})

export default assetsSlice.reducer
