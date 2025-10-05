import paypal from "paypal-rest-sdk";
import dotenv from "dotenv";

dotenv.config();

// Validate PayPal credentials
if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
  console.error("❌ PayPal credentials are missing!");
  console.error(
    "Please check your .env file for PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET"
  );
} else {
  console.log("✅ PayPal credentials loaded");
}

paypal.configure({
  mode: process.env.PAYPAL_MODE || "sandbox", // Change to 'live' for production
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

export default paypal;
