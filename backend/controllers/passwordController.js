const { connectDB } = require("../config/db");
const CryptoJS = require("crypto-js");

// ✅ GET PASSWORDS
const getPasswords = async (req, res) => {
  const db = await connectDB();
  const collection = db.collection("passwords");

  const findResult = await collection.find({
    user: req.user.email
  }).toArray();

  // 🔓 DECRYPT
  const decryptedData = findResult.map(item => {
    const bytes = CryptoJS.AES.decrypt(item.password, "secret123");
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    return {
      ...item,
      password: originalPassword
    };
  });

  res.json(decryptedData);
};

// ✅ ADD PASSWORD
const addPassword = async (req, res) => {
  const data = req.body;

  const db = await connectDB();
  const collection = db.collection("passwords");

  const encryptedPassword = CryptoJS.AES.encrypt(
    data.password,
    "secret123"
  ).toString();

  await collection.insertOne({
    ...data,   // 🔥 FIXED (not data.body)
    password: encryptedPassword,
    user: req.user.email
  });

  res.json({ success: true });
};

// ✅ DELETE PASSWORD
const deletePassword = async (req, res) => {
  const db = await connectDB();
  const collection = db.collection("passwords");

  await collection.deleteOne({
    id: req.body.id,
    user: req.user.email
  });

  res.json({ success: true });
};

module.exports = {
  getPasswords,
  addPassword,
  deletePassword
};