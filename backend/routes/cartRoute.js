import express from "express";
import { addToCart,removeFromCart,getCart } from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/auth.js";

// create express router..
export const cartRouter = express.Router();

// Router..
cartRouter.post("/add",authMiddleware,addToCart);
cartRouter.post("/remove",authMiddleware,removeFromCart);
cartRouter.post("/get",authMiddleware,getCart)


