const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dashboardRoutes = require("./routes/dashboardRoutes");

const { connectDB } = require("./config/database");
const authRoutes = require("./routes/authRoutes");

require("./models");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();