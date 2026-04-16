const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // allow
  } else {
    res.status(403).json({ message: "Admin only ❌" });
  }
};

module.exports = adminMiddleware;