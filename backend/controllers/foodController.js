import { foodModel } from "../models/foodModel.js";
import fs from "fs";

// Add food items
const addFood = async (req, res) => {
    try {

        if (!req.file) {
            return res.json({ success: false, message: "No image uploaded" });
        }

        const image_filename = req.file.filename;

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename
        });

        await food.save();

        res.json({
            success: true,
            message: "Food Added..",
            imageUrl: `http://localhost:7000/images/${image_filename}`
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
        
        fs.unlink(`uploads/${food.image}`, () => { }) // Delete image from folder..
        
        await foodModel.findByIdAndDelete(req.body.id); // food data delete from DB...

        res.json({ success: true, message: "Food Removed.." })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export { addFood, listFood, removeFood };
