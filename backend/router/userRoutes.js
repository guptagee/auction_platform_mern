import express from "express";
import {
  fetchLeaderboard,
  getProfile,
  login,
  logout,
  register,
  updateProfile,
  testEmail,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated, getProfile);
router.put("/update", isAuthenticated, updateProfile);
router.get("/logout", isAuthenticated, logout);
router.get("/leaderboard", fetchLeaderboard);
router.post("/test-email", testEmail); // Test email endpoint

export default router;
