const express = require("express");
const router = express.Router();
const Order = require("../models/order");

// Submit a new order
router.post("/submit-order", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: "✅ Order saved successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Failed to save order" });
  }
});

// Get all orders
router.get("/get-orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Failed to fetch orders" });
  }
});

// Confirm an order (just update status)
router.patch("/confirm-order/:id", async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, { status: "confirmed" });
    res.json({ message: "✅ Order confirmed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Failed to confirm order" });
  }
});

// Reject an order (just update status)
router.patch("/reject-order/:id", async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, { status: "rejected" });
    res.json({ message: "🚫 Order rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Failed to reject order" });
  }
});

// Get confirmed orders
router.get("/confirmed-orders", async (req, res) => {
  try {
    const confirmedOrders = await Order.find({ status: "confirmed" }).sort({ createdAt: -1 });
    res.json(confirmedOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Failed to fetch confirmed orders" });
  }
});

// Get rejected orders
router.get("/rejected-orders", async (req, res) => {
  try {
    const rejectedOrders = await Order.find({ status: "rejected" }).sort({ createdAt: -1 });
    res.json(rejectedOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Failed to fetch rejected orders" });
  }
});

// Get pending orders
router.get("/pending-orders", async (req, res) => {
  try {
    const pendingOrders = await Order.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json(pendingOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Failed to fetch pending orders" });
  }
});

module.exports = router;
