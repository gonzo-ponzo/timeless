import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./authSlice"
import recordSlice from "./recordSlice"
import dateSlice from "./dateSlice"
import serviceSlice from "./serviceSlice"
import userReducer from "./userSlice"
import clientSlice from "./clientSlice"
import languageSlice from "./languageSlice"

export default configureStore({
  reducer: {
    user: userReducer,
    client: clientSlice,
    auth: authSlice,
    record: recordSlice,
    date: dateSlice,
    service: serviceSlice,
    lang: languageSlice,
  },
})
