import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

//register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const hashpassword = bcrypt.hash(password, 12);
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
    console.log(error);
    res.status(500).json({ success: false, message: "Some error occured" });
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
