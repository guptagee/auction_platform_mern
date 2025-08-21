import { config } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { connection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./router/userRoutes.js";
import auctionItemRouter from "./router/auctionItemRoutes.js";
import bidRouter from "./router/bidRoutes.js";
import commissionRouter from "./router/commissionRouter.js";
import superAdminRouter from "./router/superAdminRoutes.js";
import contactRouter from "./router/contactRoutes.js";
import { endedAuctionCron } from "./automation/endedAuctionCron.js";
import { verifyCommissionCron } from "./automation/verifyCommissionCron.js";
import { startAuctionCron } from "./automation/startAuctionCron.js";

// Load environment variables
config({ path: "./config/config.env" });

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL.split(",").map((url) => url.trim()),
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // needed for cookies
  })
);

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auctionitem", auctionItemRouter);
app.use("/api/v1/bid", bidRouter);
app.use("/api/v1/commission", commissionRouter);
app.use("/api/v1/superadmin", superAdminRouter);
app.use("/api/v1/contact", contactRouter);

// Cron jobs
endedAuctionCron();
verifyCommissionCron();
startAuctionCron();

// Database connection
connection();

// Error handling middleware (should be after all routes)
app.use(errorMiddleware);

export default app;

