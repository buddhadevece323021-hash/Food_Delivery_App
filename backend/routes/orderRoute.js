import express from "express";
import { listOrders, placeOrder, updateStatus, userOrder, verifyOrder } from "../controllers/orderController.js";
import userAuth from "../middleware/userAuth.js";
import  adminAuth  from "../middleware/adminAuth.js";

export const orderRouter = express.Router();

orderRouter.post("/userorder",userAuth,userOrder);
orderRouter.get("/list", adminAuth, listOrders);
orderRouter.post("/status", adminAuth,updateStatus);
orderRouter.post("/place", userAuth, placeOrder);
orderRouter.post("/verify", userAuth, verifyOrder);
orderRouter.post("/userorders", userAuth, userOrder);
