import express from "express";

import {
  addToCart,
  fetchCartItem,
  updateCartItem,
  DeleteCartItem,
} from "../../controllers/shop/cart-controller.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/get/:userId", fetchCartItem);
router.post("/update-cart", updateCartItem);
router.post("/:userId/:productId", DeleteCartItem);

export default router;
