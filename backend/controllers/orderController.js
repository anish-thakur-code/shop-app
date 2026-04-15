const Order = require("../models/Order");

// USER: Place an order
const placeOrder = async (req, res) => {
  const { items, totalPrice } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items in order" });
  }

  const order = await Order.create({
    user: req.user._id,
    userName: req.user.name,
    userEmail: req.user.email,
    items,
    totalPrice,
  });

  res.status(201).json(order);
};

// USER: Get my orders
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// ADMIN: Get all orders
const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
};

// ADMIN: Update order status
const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = req.body.status || order.status;
  const updated = await order.save();
  res.json(updated);
};

module.exports = { placeOrder, getMyOrders, getAllOrders, updateOrderStatus };
