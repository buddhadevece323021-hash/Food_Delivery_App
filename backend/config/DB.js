import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";

dotenv.config();

// Fix Node.js DNS resolution
dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log(
            "DB connected....",
            mongoose.connection.name
        );
    } catch (error) {
        console.log("DB connection failed:", error.message);
        process.exit(1);
    }
};