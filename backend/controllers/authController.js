const { connectDB } = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

// ================= SIGNUP =================
const signup = async (req, res) => {
  try {
    let { email, password } = req.body;

    // TRIM
    email = email?.trim();
    password = password?.trim();

    // VALIDATION
    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // EMAIL VALIDATION (STRONG)
    if (!validator.isEmail(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    // PASSWORD VALIDATION
    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    const db = await connectDB();
    const users = db.collection("users");

    // CHECK EXISTING USER
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // SAVE USER
    await users.insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    return res.status(201).json({
      success: true,
      msg: "Signup successful"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// ================= LOGIN =================
const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // TRIM
    email = email?.trim();
    password = password?.trim();

    // VALIDATION
    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    const db = await connectDB();
    const users = db.collection("users");

    // FIND USER
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // CHECK JWT SECRET
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: "JWT secret not configured" });
    }

    // GENERATE TOKEN
    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { signup, login };