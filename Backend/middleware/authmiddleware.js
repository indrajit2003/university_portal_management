const jwt = require("jsonwebtoken");
const User = require("../models/user");

// 🔐 PROTECT ROUTE (LOGIN REQUIRED)
const protect = async (req, res, next) => {
  try {
    let token;

    // 👉 token check
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ❌ no token
    if (!token) {
      return res.status(401).json({ message: "Not authorized ❌" });
    }

    // 👉 verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 👉 get user from DB (without password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found ❌" });
    }

    // 👉 attach user
    req.user = user;

    next();

  } catch (error) {
    console.log("Auth Error:", error.message);
    return res.status(401).json({ message: "Token failed ❌" });
  }
};


// 👑 ADMIN MIDDLEWARE
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Admin only ❌" });
  }
};

module.exports = { protect, adminMiddleware };