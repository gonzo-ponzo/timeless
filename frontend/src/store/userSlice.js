import { createSlice } from "@reduxjs/toolkit";
import userService from "../services/user.service";

const initialState = {
  entities: null,
  selectedMaster: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUsers: (state, action) => {
      state.entities = action.payload;
    },
    createUser: (state, action) => {
      if (!Array.isArray(state.entities)) {
        state.entities = [];
      }
      state.entities.push(action.payload);
    },
    updateUser: (state, action) => {
      state.entities[
        state.entities.findIndex((user) => user._id === action.payload._id)
      ] = action.payload;
    },
    setSelectedMaster: (state, action) => {
      state.selectedMaster = action.payload;
    },
  },
});

export const { getUsers, createUser, setSelectedMaster, updateUser } =
  userSlice.actions;

export const loadUsers = () => async (dispatch) => {
  try {
    const users = await userService.getUsers();
    dispatch(getUsers(users));
  } catch (error) {
    console.log(error);
  }
};

export default userSlice.reducer;
