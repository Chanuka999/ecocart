import mongoose from "mongoose";

const ProductReviewSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    reviewMessage: {
      type: String,
      required: true,
    },
    reviewValue: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

const ProductReview = mongoose.model("ProductReview", ProductReviewSchema);

export default ProductReview;
