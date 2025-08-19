import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
  title: String,
  description: String,
  startingBid: Number,
  category: String,
  condition: {
    type: String,
    enum: ["New", "Used"],
  },
  currentBid: { type: Number, default: 0 },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Active", "Ended", "Cancelled"],
    default: "Pending"
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  auctioneer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bids: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bid",
      },
      userName: String,
      profileImage: String,
      amount: Number,
    },
  ],
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  commissionCalculated: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure auctioneer defaults to createdBy if not provided
auctionSchema.pre("validate", function(next) {
  if (!this.auctioneer && this.createdBy) {
    this.auctioneer = this.createdBy;
  }
  next();
});

// Debug: Log the schema structure
console.log('🔍 Auction Schema compiled with fields:', Object.keys(auctionSchema.paths));
console.log('🔍 Auctioneer field details:', auctionSchema.paths.auctioneer);

export const Auction = mongoose.model("Auction", auctionSchema);
