import Feature from "../../models/Feature.js";

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    const featureImages = new Feature({
      image,
    });

    await featureImages.save();
    res.status(201).json({
      success: true,
      data: featureImages,
    });
  } catch (error) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getFeatureImage = async (req, res) => {
  try {
    const images = await Feature.find({});

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const deleteFeatureImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Missing id" });
    }

    const deleted = await Feature.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Feature not found" });
    }

    res.status(200).json({ success: true, data: deleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

export { addFeatureImage, getFeatureImage, deleteFeatureImage };
