import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Auction } from "../models/auctionSchema.js";
import { Bid } from "../models/bidSchema.js";
import { User } from "../models/userSchema.js";
import { sendBidPlacedEmail, sendAuctionWonEmail } from "../utils/sendEmail.js";

export const placeBid = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction Item not found.", 404));
  }
  const { amount } = req.body;
  if (!amount) {
    return next(new ErrorHandler("Please place your bid.", 404));
  }
  if (amount <= auctionItem.currentBid) {
    return next(
      new ErrorHandler("Bid amount must be greater than the current bid.", 404)
    );
  }
  if (amount < auctionItem.startingBid) {
    return next(
      new ErrorHandler("Bid amount must be greater than starting bid.", 404)
    );
  }

  try {
    const existingBid = await Bid.findOne({
      "bidder.id": req.user._id,
      auctionItem: auctionItem._id,
    });
    const existingBidInAuction = auctionItem.bids.find(
      (bid) => bid.userId.toString() == req.user._id.toString()
    );
    if (existingBid && existingBidInAuction) {
      existingBidInAuction.amount = amount;
      existingBid.amount = amount;
      await existingBidInAuction.save();
      await existingBid.save();
      auctionItem.currentBid = amount;
    } else {
      const bidderDetail = await User.findById(req.user._id);
      const bid = await Bid.create({
        amount,
        bidder: {
          id: bidderDetail._id,
          userName: bidderDetail.userName,
          profileImage: bidderDetail.profileImage?.url,
        },
        auctionItem: auctionItem._id,
      });
      auctionItem.bids.push({
        userId: req.user._id,
        userName: bidderDetail.userName,
        profileImage: bidderDetail.profileImage?.url,
        amount,
      });
      auctionItem.currentBid = amount;
    }
    await auctionItem.save();

    // Send bid confirmation email to bidder
    try {
      await sendBidPlacedEmail(req.user.email, auctionItem.title, amount, req.user.userName);
      console.log('✅ Bid confirmation email sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send bid confirmation email:', emailError);
      // Don't fail the bid placement if email fails
    }

    res.status(201).json({
      success: true,
      message: "Bid placed.",
      currentBid: auctionItem.currentBid,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message || "Failed to place bid.", 500));
  }
});

// Function to send winning bid notification manually
export const sendWinningBidNotification = catchAsyncErrors(async (req, res, next) => {
  const { auctionId } = req.params;
  
  if (!auctionId) {
    return next(new ErrorHandler("Auction ID is required.", 400));
  }

  try {
    // Find the auction
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return next(new ErrorHandler("Auction not found.", 404));
    }

    // Check if auction has ended
    if (new Date(auction.endTime) > new Date()) {
      return next(new ErrorHandler("Auction has not ended yet.", 400));
    }

    // Find the highest bidder
    const highestBid = await Bid.findOne({
      auctionItem: auction._id,
      amount: auction.currentBid,
    });

    if (!highestBid) {
      return next(new ErrorHandler("No bids found for this auction.", 404));
    }

    // Get bidder and auctioneer details
    const bidder = await User.findById(highestBid.bidder.id);
    const auctioneer = await User.findById(auction.createdBy);

    if (!bidder || !auctioneer) {
      return next(new ErrorHandler("User information not found.", 404));
    }

    // Send winning bid notification email
    await sendAuctionWonEmail(
      bidder.email, 
      auction.title, 
      auction.currentBid, 
      bidder.userName, 
      auctioneer
    );

    res.status(200).json({
      success: true,
      message: "Winning bid notification sent successfully!",
      data: {
        auctionTitle: auction.title,
        winner: bidder.userName,
        winningBid: auction.currentBid,
        emailSentTo: bidder.email
      }
    });

  } catch (error) {
    console.error("Error sending winning bid notification:", error);
    return next(new ErrorHandler("Failed to send winning bid notification.", 500));
  }
});
