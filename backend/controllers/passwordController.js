const { connectDB } = require("../config/db");
const CryptoJS = require("crypto-js");

//  GET PASSWORDS
const getPasswords = async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("passwords");

    const findResult = await collection.find({
      user: req.user.email
    }).toArray();

    // DECRYPT
    const decryptedData = findResult.map(item => {
      const bytes = CryptoJS.AES.decrypt(
        item.password,
        process.env.SECRET_KEY
      );
      const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

      return {
        ...item,
        password: originalPassword
      };
    });

    res.json(decryptedData);

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ADD PASSWORD
const addPassword = async (req, res) => {
  try {
    const data = req.body;

    // VALIDATION
    if (!data.site || !data.username || !data.password) {
      return res.json({ msg: "All fields required" });
    }

    const db = await connectDB();
    const collection = db.collection("passwords");

    // ENCRYPT
    const encryptedPassword = CryptoJS.AES.encrypt(
      data.password,
      process.env.SECRET_KEY   // 🔥 SAME KEY
    ).toString();

    await collection.insertOne({
      ...data,
      password: encryptedPassword,
      user: req.user.email
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// DELETE PASSWORD
const deletePassword = async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("passwords");

    await collection.deleteOne({
      id: req.body.id,
      user: req.user.email
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  getPasswords,
  addPassword,
  deletePassword
};