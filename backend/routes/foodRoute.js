import express from "express"
import { addFood, listFood, removeFood } from "../controllers/foodController.js"
import multer from "multer"
import adminAuth from "../middleware/adminAuth.js";

export const foodRouter = express.Router();

// image storage Engine

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})
const upload = multer({ storage: storage });

// Router...
foodRouter.post("/add", adminAuth, upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", adminAuth, removeFood);



