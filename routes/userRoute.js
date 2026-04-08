const express = require("express");
const router = express.Router();
const {
  createUser,
  login,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controller/userController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
// Rate limiter
const rateLimit = require("express-rate-limit");

// Rate limiter function: 10 requests per 10 minutes
const generalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: "Too many requests from this IP, please try again after 10 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*`headers
});

// protect route
router.use(protect);

// 1. Static/Specific Routes
router.get("/users", getAllUsers);
router.post("/login", generalLimiter, login);
router.post("/users/new", authorizeRoles("admin"), createUser);

// 2. Dynamic/ID Routes
router.get("/users/:id", getUser);
router.put("/users/:id", authorizeRoles("admin"), updateUser);
router.delete("/users/:id", authorizeRoles("admin"), deleteUser);

module.exports = router;
