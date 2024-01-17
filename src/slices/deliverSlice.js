import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  deliver: false,
}

export const deliverSlice = createSlice({
  name: 'deliver',
  initialState,
  reducers: {
    setDeliver: (state, action) => {
      state.deliver = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setDeliver } = deliverSlice.actions

export const selectDeliver = state => state.featured.featured

export default deliverSlice.reducer