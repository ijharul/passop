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
const { checkPasswordBreach } = require("../controllers/breachController");
const { validatePasswordEntry } = require("../middleware/validate");

// routes
router.get("/getpasswords", auth, getPasswords);
router.post("/savepassword", auth, validatePasswordEntry, addPassword);
router.delete("/deletepassword", auth, deletePassword);
router.post("/check-breach", auth, checkPasswordBreach);

module.exports = router;