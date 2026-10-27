import express from "express";
import rateLimit from "express-rate-limit";
import { aiChat, getRecommendations } from "../controllers/aiController.js";
import userAuth from "../middleware/userAuth.js";

export const aiRouter = express.Router();

const limiter = rateLimit({ windowMs: 60 * 1000, max: 15 });

aiRouter.post("/chat", userAuth, limiter, aiChat);
aiRouter.post("/recommend", userAuth, limiter, getRecommendations);