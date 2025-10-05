import express from "express";
import paypal from "../../helpers/paypal.js";

const router = express.Router();

// Test PayPal connection
router.get("/test-paypal", (req, res) => {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:5173/shop/paypal-return",
      cancel_url: "http://localhost:5173/shop/paypal-cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Test Item",
              sku: "test-001",
              price: "1.00",
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "1.00",
        },
        description: "Test PayPal payment",
      },
    ],
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      console.log("PayPal Error:", error);
      res.status(500).json({
        success: false,
        message: "PayPal connection failed",
        error: error.response ? error.response : error.message,
      });
    } else {
      console.log("PayPal payment created successfully:", payment.id);
      const approvalURL = payment.links.find(
        (link) => link.rel === "approval_url"
      ).href;

      res.status(200).json({
        success: true,
        message: "PayPal connection successful",
        paymentId: payment.id,
        approvalURL,
      });
    }
  });
});

// Test basic server response
router.get("/ping", (req, res) => {
  res.json({
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
