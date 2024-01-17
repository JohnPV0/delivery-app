import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentLocation: null
}

export const locationSlice = createSlice({
  name: 'currentLocation',
  initialState,
  reducers: {
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setCurrentLocation } = locationSlice.actions

export const selectCurrentLocation = state => state.location.currentLocation

export default locationSlice.reducer