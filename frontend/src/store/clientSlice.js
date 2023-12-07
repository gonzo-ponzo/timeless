import { createSlice } from "@reduxjs/toolkit"
import clientService from "../services/client.service"

const initialState = {
  entities: null,
  current: null,
}

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setCurrentClient: (state, action) => {
      state.current = action.payload
    },
    createClient: (state, action) => {
      if (!Array.isArray(state.entities)) {
        state.entities = []
      }
      state.entities.push(action.payload)
    },
  },
})

export const { createClient, setCurrentClient } = clientSlice.actions
export const loadCurrentClient = (clientId) => async (dispatch) => {
  try {
    const client = await clientService.getCurrentClient(clientId)
    dispatch(setCurrentClient(client))
  } catch (error) {
    console.log(error)
  }
}

export default clientSlice.reducer
