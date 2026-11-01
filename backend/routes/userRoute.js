import express from "express";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js"
import { getUserData } from "../controllers/userController.js";
import { adminLogin } from "../controllers/authController.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserData);
userRouter.post("/admin-login", adminLogin);
export default userRouter;