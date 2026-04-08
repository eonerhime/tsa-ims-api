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
router.get("/", getAllUsers);
router.post("/login", generalLimiter, login);
router.post("/new", authorizeRoles("admin"), createUser);

// 2. Dynamic/ID Routes
router.get("/:id", getUser);
router.put("/:id", authorizeRoles("admin"), updateUser);
router.delete("/:id", authorizeRoles("admin"), deleteUser);

module.exports = router;
