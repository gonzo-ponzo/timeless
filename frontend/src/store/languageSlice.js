import { createSlice } from "@reduxjs/toolkit"
import localStorageService from "../services/localStorage.service"

const selectedLanguage = localStorageService.getLanguage()
const initialState = {
  lang: selectedLanguage ? selectedLanguage : "en",
}

const languageSlice = createSlice({
  name: "lang",
  initialState,
  reducers: {
    setStoreLanguage: (state, action) => {
      state.lang = action.payload
    },
  },
})

export const { setStoreLanguage } = languageSlice.actions

export default languageSlice.reducer
