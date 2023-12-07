import { createSlice } from "@reduxjs/toolkit";
import localStorageService from "../services/localStorage.service";

const initialState = {
  client: false,
  user: false,
};

const clientExpiresDate = localStorageService.getClientExpiresDate();
if (clientExpiresDate) {
  if (clientExpiresDate < Date.now()) {
    localStorageService.removeClientAuthData();
    initialState.client = false;
  } else {
    initialState.client = true;
  }
}

const userExpiresDate = localStorageService.getUserExpiresDate();
if (userExpiresDate) {
  if (userExpiresDate < Date.now()) {
    localStorageService.removeUserAuthData();
    initialState.user = false;
  } else {
    initialState.user = true;
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginClient: (state, action) => {
      state.client = true;
    },
    logoutClient: (state, action) => {
      state.client = false;
    },
    loginUser: (state, action) => {
      state.user = true;
    },
    logoutUser: (state, action) => {
      state.user = false;
    },
  },
});

export const { loginClient, loginUser, logoutClient, logoutUser } =
  authSlice.actions;

export default authSlice.reducer;
