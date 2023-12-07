import { createSlice } from "@reduxjs/toolkit";
import serviceService from "../services/service.service";

const initialState = {
  entities: null,
};

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    getServices: (state, action) => {
      state.entities = action.payload;
    },
    createService: (state, action) => {
      if (!Array.isArray(state.entities)) {
        state.entities = [];
      }
      state.entities.push(action.payload);
    },
  },
});

export const { getServices, createService } = serviceSlice.actions;

export const loadServices = () => async (dispatch) => {
  try {
    const services = await serviceService.getServices();
    dispatch(getServices(services));
  } catch (error) {
    console.log(error);
  }
};
export default serviceSlice.reducer;
