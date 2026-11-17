import { foodModel } from "../models/foodModel.js";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";




const uploadToCloudinary = (buffer) =>
    new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ folder: "food" }, (err, result) =>
                err ? reject(err) : resolve(result)
            )
            .end(buffer);
    });

// Add food items
const addFood = async (req, res) => {
    try {

        if (!req.file) {
            return res.json({ success: false, message: "No image uploaded" });
        }

        const result = await uploadToCloudinary(req.file.buffer);

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: result.secure_url,      // full URL
            imagePublicId: result.public_id // needed for delete
        });

        await food.save();

        res.json({
            success: true,
            message: "Food Added..",
        });


    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get All food list....
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods })
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Remove food items...
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id); // find food from foodModel using id... 
 if (!food) return res.json({ success: false, message: "Food not found" });
 if (food.imagePublicId) await cloudinary.uploader.destroy(food.imagePublicId);
        //fs.unlink(`uploads/${food.image}`, () => { }) // Delete image from folder..

        await foodModel.findByIdAndDelete(req.body.id); // food data delete from DB...

        res.json({ success: true, message: "Food Removed.." })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export { addFood, listFood, removeFood };
