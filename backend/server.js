require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

const app = express();
const { apiLimiter } = require("./middleware/rateLimiter");

// Apply rate limiter to all requests
app.use(apiLimiter);

// CORS 
app.use(cors({
  origin: [
    "https://passop-flame.vercel.app", 
    "http://localhost:5173", 
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176"
  ],
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true
}));


app.use(bodyParser.json());

// routes
app.use("/", authRoutes);
app.use("/", passwordRoutes);

// server start
app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});