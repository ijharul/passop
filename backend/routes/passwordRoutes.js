const express = require("express");
const router = express.Router();

//middleware import
const auth = require("../middleware/auth");

// controllers import
const {
  getPasswords,
  addPassword,
  deletePassword
} = require("../controllers/passwordController");

// outes
router.get("/", auth, getPasswords);
router.post("/", auth, addPassword);
router.delete("/", auth, deletePassword);

module.exports = router;