import { UserStateProps, UserProps } from "@/app/types/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserStateProps = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProps>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    updateUser(state, action: PayloadAction<Partial<UserProps>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setUser, updateUser, setLoading, setError, logout } =
  userSlice.actions;

export default userSlice.reducer;
