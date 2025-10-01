import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/index.js";
import adminProductsSlice from "./admin/product-slice/index.js";
import shoppingProductSlice from "./shop/product-slice/index.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsSlice,
    shopProducts: shoppingProductSlice,
  },
});

export default store;
