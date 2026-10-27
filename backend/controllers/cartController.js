import { userModel } from "../models/userModel.js";

// Add to cart..
export const addToCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.user.userId);
        const cartData = await userData.cartData;
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        }
        else {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.user.userId, { cartData });
        res.json({ success: true, message: "Added To Cart" })
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Remove items from cart...
export const removeFromCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.user.userId)
        let cartData = await userData.cartData;
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.user.userId, { cartData });
        res.json({ success: true, message: "Remove Item From Cart" })
    } catch (error) {
        res.json({ success: false, message: error.message });
    }

}

// Fetch user cart data..
export const getCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.user.userId);
        const cartData = userData.cartData;
        res.json({ success: true, cartData })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
