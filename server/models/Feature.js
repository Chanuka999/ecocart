import mongoose from "mongoose";

const FeatureSchema = new mongoose.Schema(
  {
    image: String,
  },
  { timestamps: true }
);

const feature = mongoose.model("Feature", FeatureSchema);

export default feature;
