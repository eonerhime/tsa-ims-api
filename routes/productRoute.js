const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/cloudinary");

// protect route
router.use(protect);

// 1. Static/Specific Routes
router.get("/", getAllProducts);
router.post(
  "/new",
  upload.single("imageUrl"),
  authorizeRoles("admin"),
  createProduct,
);

// 2. Dynamic/ID Routes
router.get("/:id", getProduct);
router.put(
  "/:id",
  upload.single("imageUrl"),
  authorizeRoles("admin"),
  updateProduct,
);
router.delete("/:id", authorizeRoles("admin"), deleteProduct);

module.exports = router;
