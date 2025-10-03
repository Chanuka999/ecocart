import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  addressList: [],
};

export const addNewAddress = createAsyncThunk(
  "/address/addNewAddress",
  async (formData) => {
    const responce = await axios.post(
      "http://localhost:5000/api/shop/address/add",
      formData
    );

    return responce.data;
  }
);

export const fetchAllAddress = createAsyncThunk(
  "/address/fetchAllAddress",
  async (userId) => {
    const responce = await axios.get(
      `http://localhost:5000/api/shop/address/get/${userId}`
    );

    return responce.data;
  }
);

export const editAddress = createAsyncThunk(
  "/address/editAddress",
  async ({ userId, addressId, formData }) => {
    const responce = await axios.put(
      `http://localhost:5000/api/shop/address/update/${userId}/${addressId}`,
      formData
    );

    return responce.data;
  }
);

export const deleteAddress = createAsyncThunk(
  "/address/deleteAddress",
  async ({ userId, addressId }) => {
    const responce = await axios.delete(
      `http://localhost:5000/api/shop/address/delete/${userId}/${addressId}`
    );

    return responce.data;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAllAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetchAllAddress.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      })
      .addCase(editAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(editAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(deleteAddress.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default addressSlice.reducer;
