const express = require("express");
const router = express.Router();
const { isAdmin, isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { getProductById, createProduct, getProduct, getAllUniqueCategories, getAllProducts, photo, updateProduct, deleteProduct } = require("../controllers/product");

//Params
router.param("userId", getUserById);

router.param("productId", getProductById);

router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct)

router.get("/product/:productId", getProduct)

router.get("/products", getAllProducts)

router.get("/product/photo/:productId", photo)

router.put("/product/:userId/:productId", isSignedIn, isAuthenticated, isAdmin, updateProduct)

router.delete("/product/:userId/:productId", isSignedIn, isAuthenticated, isAdmin, deleteProduct)

router.get("/products/categories", getAllUniqueCategories)


module.exports = router;
