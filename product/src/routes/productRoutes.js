const express = require("express");
const ProductController = require("../controllers/productController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();
const productController = new ProductController();

router.post("/", authenticate, productController.createProduct);
router.get("/", authenticate, productController.getProducts);
router.post("/buy", authenticate, productController.createOrder);

module.exports = router;
