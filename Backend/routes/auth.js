const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { protect } = require("../middleware/authmiddleware");


// 👉 REGISTER
router.post("/register", async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    email = email.trim().toLowerCase();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    await user.save();

    res.json({ message: "Registered Successfully ✅" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error ❌" });
  }
});


// 👉 LOGIN (NAME OR EMAIL)
router.post("/login", async (req, res) => {
  try {
    let { name, email, password } = req.body;

    let user;

    // ✅ if email diya hai
    if (email) {
      email = email.trim().toLowerCase();
      user = await User.findOne({ email });
    }

    // ✅ agar email se nahi mila, name se try karo
    if (!user && name) {
      user = await User.findOne({ name });
    }

    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password ❌" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error ❌" });
  }
});


// 👉 PROFILE
router.get("/profile", protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: "Error ❌" });
  }
});

module.exports = router;