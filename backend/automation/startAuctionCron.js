import cron from "node-cron";
import { Auction } from "../models/auctionSchema.js";

export const startAuctionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    try {
      const now = new Date();
      const nowString = now.toISOString();
      console.log("🕐 Cron for starting auctions running...", nowString);
      
      // Find auctions that should be active (startTime <= now and endTime > now)
      const auctionsToStart = await Auction.find({
        status: "Pending",
        startTime: { $lte: nowString },
        endTime: { $gt: nowString }
      });
      
      if (auctionsToStart.length > 0) {
        console.log(`🚀 Found ${auctionsToStart.length} auctions to start`);
        
        // Update status to Active
        const updateResult = await Auction.updateMany(
          {
            _id: { $in: auctionsToStart.map(auction => auction._id) }
          },
          {
            $set: { status: "Active" }
          }
        );
        
        console.log(`✅ Updated ${updateResult.modifiedCount} auctions to Active status`);
        
        // Log the auctions that were started
        for (const auction of auctionsToStart) {
          console.log(`🎯 Started auction: ${auction.title} (ID: ${auction._id})`);
        }
      } else {
        console.log("📭 No auctions to start at this time");
      }
      
      // Also check for auctions that should be ended (endTime <= now and status is Active)
      const auctionsToEnd = await Auction.find({
        status: "Active",
        endTime: { $lte: nowString }
      });
      
      if (auctionsToEnd.length > 0) {
        console.log(`⏰ Found ${auctionsToEnd.length} auctions to end`);
        
        // Update status to Ended
        const endResult = await Auction.updateMany(
          {
            _id: { $in: auctionsToEnd.map(auction => auction._id) }
          },
          {
            $set: { status: "Ended" }
          }
        );
        
        console.log(`🏁 Updated ${endResult.modifiedCount} auctions to Ended status`);
        
        // Log the auctions that were ended
        for (const auction of auctionsToEnd) {
          console.log(`🏁 Ended auction: ${auction.title} (ID: ${auction._id})`);
        }
      }
      
    } catch (error) {
      console.error("❌ Error in startAuctionCron:", error);
    }
  });
};
