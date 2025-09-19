import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

//register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({
        success: false,
        message: "Üser already exits with the same email please",
      });
    }
    const hashpassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      userName,
      email,
      password: hashpassword,
    });

    await newUser.save();
    res
      .status(200)
      .json({ success: true, message: "Registration successfull" });
  } catch (error) {
    console.error("Registration error:", error);
    let message = "Some error occured";
    if (error.code === 11000) {
      // Duplicate key error
      message = `Duplicate field: ${Object.keys(error.keyValue).join(", ")}`;
    } else if (error.message) {
      message = error.message;
    }
    res.status(500).json({ success: false, message });
  }
};

//login
const login = async () => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Some error occured" });
  }
};

export default registerUser;
