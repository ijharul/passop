const validator = require("validator");

const validateAuth = (req, res, next) => {
  let { email, password } = req.body;
  email = email?.trim() || "";
  password = password?.trim() || "";

  if (!email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ msg: "Invalid email format" });
  }

  if (password.length < 6) {
    return res.status(400).json({ msg: "Password must be at least 6 characters" });
  }

  next();
};

const validatePasswordEntry = (req, res, next) => {
  const { site, username, password } = req.body;

  if (!site || !username || !password) {
    return res.status(400).json({ msg: "Site, username, and password are required" });
  }

  if (site.length < 3) {
    return res.status(400).json({ msg: "Site name is too short" });
  }

  next();
};

module.exports = { validateAuth, validatePasswordEntry };
