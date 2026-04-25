const { connectDB } = require("../config/db");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../utils/cryptoUtils");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signup = async (email, password) => {
  const db = await connectDB();
  const users = db.collection("users");

  const existingUser = await users.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await hashPassword(password);
  await users.insertOne({
    email,
    password: hashedPassword,
    provider: "local",
    createdAt: new Date()
  });

  return { msg: "Signup successful" };
};

const login = async (email, password) => {
  const db = await connectDB();
  const users = db.collection("users");

  const user = await users.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  if (user.provider === "google") {
    throw new Error("This account uses Google Sign-In. Please use the Google button.");
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  if (!process.env.JWT_SECRET) throw new Error("JWT secret not configured");

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return { token };
};

const forgotPassword = async (email) => {
  const db = await connectDB();
  const users = db.collection("users");

  const user = await users.findOne({ email });
  if (!user) throw new Error("User not found");

  const token = Math.random().toString(36).slice(-8);
  const expires = new Date(Date.now() + 3600000);

  await users.updateOne({ email }, { $set: { resetToken: token, resetExpires: expires } });

  console.log("------------------------------------------");
  console.log(`RESET LINK FOR ${email}: http://localhost:5173/reset-password?token=${token}&email=${email}`);
  console.log("------------------------------------------");

  return { msg: "Reset link generated (Check Console)" };
};

const resetPassword = async (email, token, newPassword) => {
  const db = await connectDB();
  const users = db.collection("users");

  const user = await users.findOne({ 
    email, 
    resetToken: token, 
    resetExpires: { $gt: new Date() } 
  });

  if (!user) throw new Error("Invalid or expired token");

  const hashedPassword = await hashPassword(newPassword);
  await users.updateOne({ email }, { 
    $set: { password: hashedPassword }, 
    $unset: { resetToken: "", resetExpires: "" } 
  });

  return { msg: "Password reset successful" };
};

const googleLogin = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();
  const { email, name, picture, sub: googleId } = payload;

  const db = await connectDB();
  const users = db.collection("users");

  let user = await users.findOne({ email });
  if (!user) {
    await users.insertOne({
      email,
      name,
      picture,
      googleId,
      provider: "google",
      createdAt: new Date()
    });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return { token, email, name };
};

module.exports = { signup, login, forgotPassword, resetPassword, googleLogin };
