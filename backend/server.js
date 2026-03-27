require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");

const authRoutes = require("./routes/authRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

const app = express();   

// middleware
app.use(cors({
  origin: "*"
}));

app.use(bodyparser.json());

// routes
app.use("/", authRoutes);
app.use("/", passwordRoutes);

// server start
app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});