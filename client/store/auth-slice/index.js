import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthanticated: false,
  isLoading: false,
  user: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",
  async (FormData) => {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      FormData,
      { withCredentials: true }
    );
  }
);

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
