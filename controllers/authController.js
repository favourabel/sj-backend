import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const seedAdmin = async () => {
  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  
  const admin = await User.findOneAndUpdate(
    { email: process.env.ADMIN_EMAIL },
    { email: process.env.ADMIN_EMAIL, password: hashed },
    { upsert: true, new: true }
  );

  console.log(`✅ Admin ready: ${admin.email}`);
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({ token, email: user.email });
};