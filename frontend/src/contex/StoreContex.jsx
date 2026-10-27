import { createContext, useEffect, useState } from "react";
//import { food_list } from "../assets/frontend_assets/assets";
import axios from "axios";

// Create Context
export const StoreContex = createContext(null);

const StoreContexProvider = (props) => {

    const [cartLoading, setCartLoading] = useState(true);
    // Stores cart items in the format:
    // { itemId: quantity }
    const [cartItems, setCartItems] = useState({})
    // Backend API URL
    const url = "http://localhost:7000";
    // JWT token for authentication
    //const [token, setToken] = useState("");
    // Search state
    const [search, setSearch] = useState("");
    // Food items fetched from database
    const [food_list, setFoodList] = useState([]);

    // Add item to cart
    const addToCart = async (itemId) => {

        // Update local cart state
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }

        // Update cart in database if user is logged in

        try {
            await axios.post(
                url + "/api/cart/add",
                { itemId },
                { withCredentials: true }
            );
        } catch (error) {
            console.log(error.response?.data?.message);
        }

    };


    // Remove item from cart
    const removeFromCart = async (itemId) => {

        // Update local cart state
        setCartItems((prev) => ({
            ...prev,
            [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
        }));

        // Update cart in database if user is logged in

        try {
            await axios.post(
                url + "/api/cart/remove",
                { itemId },
                { withCredentials: true }
            );
        } catch (error) {
            console.log(error.response?.data?.message);
        }

    };



    // Calculate total cart amount
    const getTotalCartAmount = () => {
        let totalAmount = 0;

        // Loop through cart items
        for (const items in cartItems) {
            if (cartItems[items] > 0) {

                // Find product details using item ID
                const itemInfo = food_list.find(
                    (product) => String(product._id) === String(items)
                );

                // Add product price × quantity
                if (itemInfo) {
                    totalAmount +=
                        Number(itemInfo.price) * Number(cartItems[items]);
                }
            }
        }

        return totalAmount;
    };

    // Fetch all food items from backend
    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data);
    };

    // Load cart data from backend
    const loadCartData = async () => {
        try {
            const response = await axios.post(
                url + "/api/cart/get",
                {},
                { withCredentials: true }
            );

            if (response.data.success) {
                // Set cart data received from backend
                setCartItems(response.data.cartData || {});
            }
        } catch (error) {
            console.error("Cart loading failed:", error);

            // Clear cart if request fails
            setCartItems({});
        } finally {
            setCartLoading(false);
        }
    };


    // Runs once when component mounts
    useEffect(() => {
        async function loadData() {
            // Fetch all food items
            await fetchFoodList();

            // Load user cart if token exists
            try {
                await loadCartData();
            } catch (error) {
                console.log(error);
            }
        }

        loadData();
    }, []);

    // Values available globally through Context API
    const constextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        search,
        setSearch,
        cartLoading,
    };

    return (
        <StoreContex.Provider value={constextValue}>
            {props.children}
        </StoreContex.Provider>
    );
};

export default StoreContexProvider;