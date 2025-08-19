import express from "express";
import { sendContactMessage } from "../controllers/contactController.js";

const router = express.Router();

// Route to send contact message
router.post("/send", sendContactMessage);

export default router;
