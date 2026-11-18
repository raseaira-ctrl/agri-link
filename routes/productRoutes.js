const express = require("express");
const router = express.Router();

const productController = require("../controller/productController");
const { protect, sellerOnly } = require("../middleware/authMiddleware");

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

router.post("/", protect, sellerOnly, productController.createProduct);
router.put("/:id", protect, sellerOnly, productController.updateProduct);
router.delete("/:id", protect, sellerOnly, productController.deleteProduct);

module.exports = router;