const { connectDB } = require("../config/db");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { email, password } = req.body;

  const db = await connectDB();
  const users = db.collection("users");

  await users.insertOne({ email, password });

  res.json({ msg: "Signup successful" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const db = await connectDB();
  const users = db.collection("users");

  const user = await users.findOne({ email, password });

  if (!user) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }

  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET
  );

  res.json({ token });
};

module.exports = { signup, login };
