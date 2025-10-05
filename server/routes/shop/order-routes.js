import express from "express";

import {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
} from "../../controllers/shop/order-controller.js";

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Order service is running",
    timestamp: new Date().toISOString(),
  });
});

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);

export default router;
