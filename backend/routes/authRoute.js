import express from "express";
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyemail, } from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

export const authRouter = express.Router()

// Route..
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

// Authentication route..
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-account", userAuth, verifyemail);
authRouter.get("/is-auth", userAuth, isAuthenticated);
authRouter.post("/send-reset-Otp", sendResetOtp);
authRouter.post("/reset-pass", resetPassword);

