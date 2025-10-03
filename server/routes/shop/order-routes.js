import express from "express";

import { createOrder } from "../../controllers/shop/order-controller";

const router = express.Router();

router.post("/create", createOrder);

export default router;
