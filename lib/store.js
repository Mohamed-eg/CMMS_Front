import { configureStore } from "@reduxjs/toolkit"
import usersReducer from "./features/users/usersSlice"
import assetsReducer from "./features/assets/assetsSlice"
import workOrdersReducer from "./features/workOrders/workOrdersSlice"
import reportsReducer from "./features/reports/reportsSlice"
import stationsReducer from "./features/stations/stationsSlice"

export const store = configureStore({
  reducer: {
    users: usersReducer,
    assets: assetsReducer,
    workOrders: workOrdersReducer,
    reports: reportsReducer,
    stations: stationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})
