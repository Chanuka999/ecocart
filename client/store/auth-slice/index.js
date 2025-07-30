import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthanticated: false,
  isLoading: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Add your auth actions here as needed
    // Example:
    // setUser: (state, action) => {
    //   state.user = action.payload;
    //   state.isAuthanticated = true;
    // },
    // logout: (state) => {
    //   state.user = null;
    //   state.isAuthanticated = false;
    // }
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
export default authSlice;
