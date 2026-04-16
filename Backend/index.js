const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Routes Import
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");
const noticeRoutes = require("./routes/notice");
const studentRoutes = require("./routes/student");

// ✅ Routes Use
app.use("/api/auth", authRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/notice", noticeRoutes);
app.use("/api/students", studentRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("API chal raha hai 🚀");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("DB Error:", err.message));

// ✅ Server Start
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});