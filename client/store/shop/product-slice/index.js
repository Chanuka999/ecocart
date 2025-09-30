import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
};

export const fetchAllFilterdProducts = createAsyncThunk(
  "/products/fetchAllProduct",
  async () => {
    const result = await axios.get(
      "http://localhost:5000/api/admin/products/get"
    );
    return result?.data;
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilterdProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilterdProducts.fulfilled, (state, action) => {
        console.log(action.payload);

        state.isLoading = false;
        state.productList = action.payload;
      })
      .addCase(fetchAllFilterdProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      });
  },
});

export default shoppingProductSlice;
