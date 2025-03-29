const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//@Route GET /api/orders/my-orders
// @desc Get logged-in user's orders
//@access Private

router.get("/my-orders", protect, async (req, res) => {
  try {
    //Find orders fir the authenticated user
    const order = await Order.find({ user: req.user._id }).sort({
      createAt: -1,
    }); // sort by most recent orders
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/orders/:id
// @desc Get order details by ID
// @access Private
router.get("/my-orders/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    } // Return the full order details
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
