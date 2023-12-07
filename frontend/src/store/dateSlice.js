import { createSlice } from "@reduxjs/toolkit";

const now = new Date();
const initialState = {
  date: `${now.toLocaleString("ru-ru", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })}`,
};

const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    setDate: (state, action) => {
      state.date = action.payload;
    },
  },
});

export const { setDate } = dateSlice.actions;

export default dateSlice.reducer;
