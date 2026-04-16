const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authmiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const Notice = require("../models/notice");


// 👉 ADD NOTICE (ADMIN ONLY)
router.post("/", protect, adminMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "All fields required ❌" });
    }

    const notice = new Notice({ title, content });
    await notice.save();

    res.json({ message: "Notice Added ✅" });

  } catch (err) {
    res.status(500).json({ message: "Error ❌" });
  }
});


// 👉 GET ALL NOTICES
router.get("/", protect, async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: "Error ❌" });
  }
});


// 👉 DELETE NOTICE (ADMIN)
router.delete("/:id", protect, adminMiddleware, async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: "Error ❌" });
  }
});

module.exports = router;