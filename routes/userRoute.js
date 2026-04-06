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

// protect route
router.use(protect);

router.post("/createUser", authorizeRoles("admin"), createUser);
router.post("/login", login);
router.get("/users", getAllUsers);
router.get("/users/:id", getUser);
router.put("/users/:id", authorizeRoles("admin"), updateUser);
router.delete("/users/:id", authorizeRoles("admin"), deleteUser);

module.exports = router;
