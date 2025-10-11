import express from "express";

import {
  addFeatureImage,
  getFeatureImage,
  deleteFeatureImage,
} from "../../controllers/common/Feature-controller.js";

const router = express.Router();

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImage);
router.delete("/delete/:id", deleteFeatureImage);

export default router;
