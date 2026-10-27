import express from "express";
import { listOrders, placeOrder, updateStatus, userOrder, verifyOrder } from "../controllers/orderController.js";
import userAuth from "../middleware/userAuth.js";

export const orderRouter = express.Router();

orderRouter.post("/userorder",userAuth,userOrder);
orderRouter.get("/list",listOrders);
orderRouter.post("/status",updateStatus);
orderRouter.post("/place", userAuth, placeOrder);
orderRouter.post("/verify", userAuth, verifyOrder);
orderRouter.post("/userorders", userAuth, userOrder);
