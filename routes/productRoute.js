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

// protect route
router.use(protect);

router.post("/products", authorizeRoles("admin"), createProduct);
router.get("/products", getAllProducts);
router.get("/products/:id", getProduct);
router.put("/products/:id", authorizeRoles("admin"), updateProduct);
router.delete("/products/:id", authorizeRoles("admin"), deleteProduct);

module.exports = router;
