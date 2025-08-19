import express from "express";
import { placeBid, sendWinningBidNotification } from "../controllers/bidController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { checkAuctionEndTime } from "../middlewares/checkAuctionEndTime.js";

const router = express.Router();

router.post(
  "/place/:id",
  isAuthenticated,
  isAuthorized("Bidder"),
  checkAuctionEndTime,
  placeBid
);

// Route to manually send winning bid notification (for testing/admin use)
router.post(
  "/send-winning-notification/:auctionId",
  isAuthenticated,
  isAuthorized("Super Admin"),
  sendWinningBidNotification
);

export default router;
