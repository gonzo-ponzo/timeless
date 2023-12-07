import { createSlice } from "@reduxjs/toolkit";
import recordService from "../services/record.service";

const initialState = {
  entities: null,
};

const recordSlice = createSlice({
  name: "record",
  initialState,
  reducers: {
    getRecords: (state, action) => {
      state.entities = action.payload;
    },
    createRecord: (state, action) => {
      if (!Array.isArray(state.entities)) {
        state.entities = [];
      }
      state.entities.push(action.payload);
    },
  },
});

export const { getRecords, createRecord } = recordSlice.actions;

export const loadRecords = () => async (dispatch) => {
  try {
    const records = await recordService.getRecords();
    dispatch(getRecords(records));
  } catch (error) {
    console.log(error);
  }
};
export default recordSlice.reducer;
