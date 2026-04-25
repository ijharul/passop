const { connectDB } = require("../config/db");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../utils/cryptoUtils");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signup = async (name, email, password) => {
  const db = await connectDB();
  const users = db.collection("users");

  const existingUser = await users.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await hashPassword(password);
  await users.insertOne({
    name,
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

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const forgotPassword = async (email) => {
  const db = await connectDB();
  const users = db.collection("users");

  const user = await users.findOne({ email });
  if (!user) throw new Error("User not found");

  const token = Math.random().toString(36).slice(-8);
  const expires = new Date(Date.now() + 3600000);

  await users.updateOne({ email }, { $set: { resetToken: token, resetExpires: expires } });

  const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${token}&email=${email}`;

  const mailOptions = {
    from: `"VaultX Security" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "VaultX Master Key Reset Protocol",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #020617; color: white; border-radius: 12px; border: 1px solid #1e293b;">
        <h1 style="color: #10b981;">VaultX Security</h1>
        <p style="color: #94a3b8;">A request was made to reset your Master Key protocol.</p>
        <div style="margin: 30px 0; padding: 20px; background-color: #0f172a; border-radius: 8px; border: 1px solid #1e293b; text-align: center;">
          <a href="${resetLink}" style="background-color: #10b981; color: #020617; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">
            Reset Master Key
          </a>
        </div>
        <p style="font-size: 12px; color: #64748b;">If you did not request this, please ignore this email. This link will expire in 1 hour.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);

  return { msg: "Security link sent to your email!" };
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
  return { token, email, name, googleId };
};

module.exports = { signup, login, forgotPassword, resetPassword, googleLogin };
