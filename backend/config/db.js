require("dotenv").config();

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

const connectDB = async () => {
  await client.connect();
  return client.db();
};

module.exports = { connectDB };