import { configureStore } from "@reduxjs/toolkit"
import usersReducer from "./features/users/usersSlice"
import assetsReducer from "./features/assets/assetsSlice"
import workOrdersReducer from "./features/workOrders/workOrdersSlice"
import reportsReducer from "./features/reports/reportsSlice"

export const store = configureStore({
  reducer: {
    users: usersReducer,
    assets: assetsReducer,
    workOrders: workOrdersReducer,
    reports: reportsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
