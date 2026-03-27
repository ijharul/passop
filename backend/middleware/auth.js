require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = data;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = auth;