const adminKeyMiddleware = (req, res, next) => {
  const adminKey = req.headers["x-admin-key"];

  if (!adminKey) {
    return res.status(401).json({ message: "Admin key is required" });
  }

  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ message: "Invalid admin key" });
  }

  next();
};

module.exports = adminKeyMiddleware;
