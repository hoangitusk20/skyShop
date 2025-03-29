const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const Product = require("../models/Product");

const router = express.Router();

//@route GET /api/admin/products
// @desc Get all products (admin only)
// @acess Private /Admin only

router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({});
    console.log(products);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
