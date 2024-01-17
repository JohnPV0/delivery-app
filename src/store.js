import { configureStore } from '@reduxjs/toolkit'
import cartSlice from './slices/cartSlice'
import restaurantSlice from './slices/restaurantSlice'
import userSlice from './slices/userSlice'
import locationSlice from './slices/locationSlice'
import deliverSlice from './slices/deliverSlice'

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    restaurant: restaurantSlice,
    user: userSlice,
    location: locationSlice,
    deliver: deliverSlice,
  },
})