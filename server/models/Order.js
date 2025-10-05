import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: String,
    cartId: String,
    cartItems: [
      {
        productId: String,
        title: String,
        image: String,
        price: String,

        quantity: Number,
      },
    ],
    addressInfo: {
      addressId: String,
      address: String,
      city: String,
      pincode: String,
      phone: String,
      notes: String,
    },
    orderStatus: String,
    paymentMethod: String,
    paymentStatus: String,
    totalAmount: Number,
    orderDate: Date,
    orderUpdateDate: Date,
    paymentId: String,
    payerId: String,
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
  }
);

// Add index to help with duplicate order checking
OrderSchema.index({ userId: 1, cartId: 1, orderStatus: 1, createdAt: 1 });

const Order = mongoose.model("Order", OrderSchema);

export default Order;
