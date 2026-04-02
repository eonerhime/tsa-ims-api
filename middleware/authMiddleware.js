const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  if (!req.headers?.authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

module.exports = protect;
