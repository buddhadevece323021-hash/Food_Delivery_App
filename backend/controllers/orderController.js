import { orderModel } from "../models/orderModel.js";
import { userModel } from "../models/userModel.js";
import { foodModel } from "../models/foodModel.js";
import { razorpay } from "../config/Razorpay.js";
import crypto from "crypto";


const DELIVERY_FEE = 30;
const STATUSES = ["Food Processing", "Out for Delivery", "Delivered"]; // match your admin panel

// COD orders + paid online orders (hides abandoned online attempts)
const visibleOrders = { $or: [{ paymentMethod: "COD" }, { payment: true }] };

// Place order: COD or Online (Razorpay)
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { items, address, paymentMethod = "ONLINE" } = req.body;

    if (!["COD", "ONLINE"].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: "Invalid payment method" });
    }

    if (!Array.isArray(items) || items.length === 0 || !address) {
      return res.status(400).json({ success: false, message: "Invalid order details" });
    }

    // Price everything from the DB, never trust the client
    const foods = await foodModel.find({ _id: { $in: items.map((i) => i._id) } });
    const orderItems = [];
    let subtotal = 0;

    for (const i of items) {
      const food = foods.find((f) => f._id.toString() === String(i._id));
      const qty = Number(i.quantity);
      if (!food || !Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({ success: false, message: "Invalid item in cart" });
      }
      subtotal += food.price * qty;
      orderItems.push({ _id: food._id, name: food.name, price: food.price, quantity: qty });
    }

    const amount = subtotal + DELIVERY_FEE;

    // ---------- Cash on Delivery ----------
    if (paymentMethod === "COD") {
      await new orderModel({
        userId,
        items: orderItems,
        amount,
        address,
        payment: false,
        paymentMethod: "COD",
      }).save();

      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      return res.json({
        success: true,
        cod: true,
        message: "Order placed (Cash on Delivery)",
      });
    }

    // ---------- Online payment (Razorpay) ----------
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    await new orderModel({
      userId,
      items: orderItems,
      amount,
      address,
      payment: false,
      paymentMethod: "ONLINE",
      razorpayOrderId: razorpayOrder.id,
    }).save();

    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({
      success: false,
      message: error?.error?.description || "Unable to create order",
    });
  }
};

// Verify payment after Razorpay checkout
export const verifyOrder = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing Razorpay payment details" });
    }

    const order = await orderModel.findOne({
      razorpayOrderId: razorpay_order_id,
      userId: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.payment) {
      return res.json({ success: true, message: "Payment already verified" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest();
    const receivedSignature = Buffer.from(razorpay_signature, "hex");

    if (
      receivedSignature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(expectedSignature, receivedSignature)
    ) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (
      payment.order_id !== razorpay_order_id ||
      payment.amount !== Math.round(Number(order.amount) * 100) ||
      payment.currency !== "INR"
    ) {
      return res.status(400).json({ success: false, message: "Payment details do not match the order" });
    }

    let confirmedPayment = payment;
    if (payment.status === "authorized") {
      confirmedPayment = await razorpay.payments.capture(
        razorpay_payment_id,
        payment.amount,
        payment.currency
      );
    }

    if (confirmedPayment.status !== "captured") {
      return res.status(400).json({ success: false, message: "Payment has not been captured" });
    }

    order.payment = true;
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    await userModel.findByIdAndUpdate(req.user.userId, { cartData: {} });

    return res.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Razorpay verification error:", error);
    return res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};

// Logged-in user's orders (COD + paid online)
export const userOrder = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.user.userId, ...visibleOrders })
      .sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: list all orders (COD + paid online)
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find(visibleOrders).sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: update status (COD is marked paid when delivered)
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const update = { status };

    const order = await orderModel.findById(orderId);
    if (order && order.paymentMethod === "COD" && status === "Delivered") {
      update.payment = true; // cash collected
    }

    await orderModel.findByIdAndUpdate(orderId, update);
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
