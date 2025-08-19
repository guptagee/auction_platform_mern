import mongoose from "mongoose";
import { Auction } from "./models/auctionSchema.js";
import { config } from "dotenv";

// Load environment variables
config({ path: "./config/config.env" });

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "MERN_AUCTION_PLATFORM"
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Check all auctions
const checkAllAuctions = async () => {
  try {
    console.log("🔍 Checking all auctions in database...");
    
    // Get all auctions with full details
    const allAuctions = await Auction.find({});
    console.log(`\n📊 Total auctions found: ${allAuctions.length}`);
    
    if (allAuctions.length === 0) {
      console.log("❌ No auctions found in database!");
      return;
    }
    
    // Display each auction in detail
    allAuctions.forEach((auction, index) => {
      console.log(`\n🔍 Auction ${index + 1}:`);
      console.log(`  ID: ${auction._id}`);
      console.log(`  Title: ${auction.title}`);
      console.log(`  Description: ${auction.description}`);
      console.log(`  Status: ${auction.status}`);
      console.log(`  Category: ${auction.category}`);
      console.log(`  Start Time: ${auction.startTime}`);
      console.log(`  End Time: ${auction.endTime}`);
      console.log(`  Starting Bid: ${auction.startingBid}`);
      console.log(`  Current Bid: ${auction.currentBid}`);
      console.log(`  Created By: ${auction.createdBy}`);
      console.log(`  Commission Calculated: ${auction.commissionCalculated}`);
      console.log(`  Created At: ${auction.createdAt}`);
      console.log(`  Updated At: ${auction.updatedAt}`);
      
      // Check if it has bids
      if (auction.bids && auction.bids.length > 0) {
        console.log(`  Bids: ${auction.bids.length} bids`);
        auction.bids.forEach((bid, bidIndex) => {
          console.log(`    Bid ${bidIndex + 1}: ${bid.amount} by ${bid.userName}`);
        });
      } else {
        console.log(`  Bids: No bids`);
      }
    });
    
    // Check raw database collection
    console.log("\n🔍 Checking raw database collection...");
    const rawAuctions = await mongoose.connection.db.collection('auctions').find({}).toArray();
    console.log(`Raw collection count: ${rawAuctions.length}`);
    
    if (rawAuctions.length > 0) {
      console.log("\n📊 Raw auction data:");
      rawAuctions.forEach((auction, index) => {
        console.log(`\nRaw Auction ${index + 1}:`);
        console.log(`  ID: ${auction._id}`);
        console.log(`  Title: ${auction.title}`);
        console.log(`  Status: ${auction.status}`);
        console.log(`  Start Time: ${auction.startTime}`);
        console.log(`  End Time: ${auction.endTime}`);
        console.log(`  All fields:`, Object.keys(auction));
      });
    }
    
  } catch (error) {
    console.error("❌ Error checking auctions:", error);
  }
};

// Run the check
const runCheck = async () => {
  await connectDB();
  await checkAllAuctions();
  process.exit(0);
};

runCheck();
