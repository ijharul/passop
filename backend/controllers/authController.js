const authService = require("../services/authService");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.signup(name?.trim(), email?.trim(), password?.trim());
    res.status(201).json(result);
  } catch (err) {
    res.status(err.message === "User already exists" ? 409 : 400).json({ msg: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email?.trim(), password?.trim());
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ msg: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    res.json(result);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    const result = await authService.resetPassword(email, token, newPassword);
    res.json(result);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const result = await authService.googleLogin(req.body.token);
    res.json(result);
  } catch (err) {
    res.status(401).json({ msg: "Google Authentication failed" });
  }
};

module.exports = { signup, login, forgotPassword, resetPassword, googleLogin };