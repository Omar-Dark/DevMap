import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from "./Slices/userSlice";
const RootReducers = combineReducers({
  user: userSlice,
});

export const store = configureStore({
  reducer: RootReducers,
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
