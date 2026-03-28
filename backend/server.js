require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");

const authRoutes = require("./routes/authRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

const app = express();   

// middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://passop-flame.vercel.app" 
  ],
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(bodyparser.json());

// routes
app.use("/", authRoutes);
app.use("/", passwordRoutes);

// server start
app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});