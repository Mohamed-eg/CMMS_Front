import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  workOrders: [],
  loading: false,
  error: null,
  filters: {
    searchTerm: "",
    statusFilter: "all",
    priorityFilter: "all",
  },
}

const workOrdersSlice = createSlice({
  name: "workOrders",
  initialState,
  reducers: {
    // Work orders reducers will be implemented here
  },
})

export default workOrdersSlice.reducer
