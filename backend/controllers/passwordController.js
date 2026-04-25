const passwordService = require("../services/passwordService");

const getPasswords = async (req, res) => {
  try {
    const result = await passwordService.getAllPasswords(req.user.email);
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const addPassword = async (req, res) => {
  try {
    const result = await passwordService.savePassword(req.user.email, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const deletePassword = async (req, res) => {
  try {
    const result = await passwordService.deletePassword(req.user.email, req.body.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  getPasswords,
  addPassword,
  deletePassword
};