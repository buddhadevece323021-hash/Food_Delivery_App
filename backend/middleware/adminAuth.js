import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({ success: false, message: "Admin login required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access only" });
    }
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired admin token" });
  }
};

export default adminAuth