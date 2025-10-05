import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

export const fetchAllFilterdProducts = createAsyncThunk(
  "/products/fetchAllProduct",
  async ({ filterParams, sortParams }) => {
    console.log(fetchAllFilterdProducts, "fetchAllFilterProducts");

    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    const result = await axios.get(
      `http://localhost:5000/api/admin/products/get?${query}`
    );
    return result?.data;
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `http://localhost:5000/api/admin/products/get?${id}`
    );
    return result?.data;
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state, action) => {
      state.productDetails = action.payload;
    },
    clearProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilterdProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilterdProducts.fulfilled, (state, action) => {
        console.log(action.payload, "action.payload");

        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilterdProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { setProductDetails, clearProductDetails } =
  shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
