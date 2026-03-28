const { connectDB } = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ msg: "All fields required" });
    }

    const db = await connectDB();
    const users = db.collection("users");

    const existing = await users.findOne({ email });
    if (existing) {
      return res.json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await users.insertOne({
      email,
      password: hashedPassword
    });

    res.json({ msg: "Signup successful" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ msg: "All fields required" });
    }

    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({ email });

    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { signup, login };