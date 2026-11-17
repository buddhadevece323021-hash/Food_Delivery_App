
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { configDotenv } from "dotenv";
import { connectDB } from "./config/DB.js";
import { foodRouter } from "./routes/foodRoute.js";
import { authRouter } from "./routes/authRoute.js";
import { cartRouter } from "./routes/cartRoute.js";
import { orderRouter } from "./routes/orderRoute.js";
import userRouter from "./routes/userRoute.js";
import { aiRouter } from "./routes/aiRoute.js";



configDotenv();

// frontend URL...
const allowedOrigins = ["process.env.FRONTEND_URL",
  "process.env.ADMIN_URL",'http://localhost:5173', 'http://localhost:5174',].filter(Boolean);

// app configaretion...
const app = express();
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

const port = process.env.PORT || 2000;

app.set("trust proxy", 1); // Render sits behind a proxy


// middleware....
app.use(express.json());
app.use(cookieParser());

// allow cookies/authorization headers..
app.use(cors({origin:allowedOrigins, credentials: true, allowedHeaders: ["Content-Type", "token"], }));

// DB connection...
connectDB();

// api end point...
app.use("/api/food", foodRouter);
/*app.use(
  "/images",
  express.static(path.join(__dirname, "uploads"))
);*/
app.use("/api/user", userRouter);
app.use('/api/auth', authRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);
app.use("/api/ai", aiRouter);

// home route.
app.get("/", (req, res) => {
    res.send("API is working...");
});

// app run on the server..
app.listen(port, () => {
    console.log(`Server running on port ${port}`);

})

