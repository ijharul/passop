const { connectDB } = require("../config/db");

const getAllPasswords = async (userEmail) => {
  const db = await connectDB();
  const collection = db.collection("passwords");
  return await collection.find({ user: userEmail }).toArray();
};

const savePassword = async (userEmail, passwordData) => {
  const db = await connectDB();
  const collection = db.collection("passwords");
  
  await collection.insertOne({
    ...passwordData,
    user: userEmail
  });
  return { success: true };
};

const deletePassword = async (userEmail, passwordId) => {
  const db = await connectDB();
  const collection = db.collection("passwords");
  
  await collection.deleteOne({
    id: passwordId,
    user: userEmail
  });
  return { success: true };
};

module.exports = { getAllPasswords, savePassword, deletePassword };
