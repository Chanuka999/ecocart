import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/index.js";
import adminProductsSlice from "./admin/product-slice/index.js";
import shoppingProductSlice from "./shop/product-slice/index.js";
import shopCartSlice from "./shop/cart-slice/index.js";
import shopReviewSlice from "./shop/review-slice/index.js";
import shopAddressSlice from "./shop/address-slice/index.js";
import shopOrderSlice from "./shop/order-slice/index.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsSlice,
    shopProducts: shoppingProductSlice,
    shopCart: shopCartSlice,
    shopReview: shopReviewSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
  },
});

export default store;
