import { User } from "../models/userSchema.js";
import { PaymentProof } from "../models/commissionProofSchema.js";
import { UserActivity } from "../models/userActivitySchema.js";
import Config from "../models/configSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import mongoose from "mongoose";

// Helper function to create activity logs
const createActivityLog = async (userId, action, description, details, performedBy, req) => {
  try {
    await UserActivity.create({
      userId,
      action,
      description,
      details,
      performedBy,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      severity: action.includes('DELETE') || action.includes('SUSPEND') ? 'HIGH' : 'LOW'
    });
  } catch (error) {
    console.error('Error creating activity log:', error);
    // Don't throw error for logging failures
  }
};

export const deleteAuctionItem = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction not found.", 404));
  }
  await auctionItem.deleteOne();
  res.status(200).json({
    success: true,
    message: "Auction item deleted successfully.",
  });
});

export const getAllPaymentProofs = catchAsyncErrors(async (req, res, next) => {
  let paymentProofs = await PaymentProof.find();
  res.status(200).json({
    success: true,
    paymentProofs,
  });
});

export const getPaymentProofDetail = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    const paymentProofDetail = await PaymentProof.findById(id);
    res.status(200).json({
      success: true,
      paymentProofDetail,
    });
  }
);

export const updateProofStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { amount, status } = req.body;
  
  console.log("🔍 Updating payment proof:", { id, amount, status });
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid ID format.", 400));
  }
  
  let proof = await PaymentProof.findById(id);
  if (!proof) {
    return next(new ErrorHandler("Payment proof not found.", 404));
  }
  
  console.log("📊 Current proof:", {
    id: proof._id,
    currentStatus: proof.status,
    currentAmount: proof.amount,
    newStatus: status,
    newAmount: amount
  });
  
  // Update the proof
  proof = await PaymentProof.findByIdAndUpdate(
    id,
    { status, amount },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  
  console.log("✅ Updated proof:", {
    id: proof._id,
    status: proof.status,
    amount: proof.amount,
    updatedAt: proof.uploadedAt
  });
  
  res.status(200).json({
    success: true,
    message: "Payment proof amount and status updated.",
    proof,
  });
});

export const deletePaymentProof = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const proof = await PaymentProof.findById(id);
  if (!proof) {
    return next(new ErrorHandler("Payment proof not found.", 404));
  }
  await proof.deleteOne();
  res.status(200).json({
    success: true,
    message: "Payment proof deleted.",
  });
});

export const fetchAllUsers = catchAsyncErrors(async (req, res, next) => {
  // Get actual user counts by role
  const superAdminCount = await User.countDocuments({ role: "Super Admin" });
  const auctioneerCount = await User.countDocuments({ role: "Auctioneer" });
  const bidderCount = await User.countDocuments({ role: "Bidder" });

  // Get actual user objects for display
  const superAdminUsers = await User.find({ role: "Super Admin" }).select('-password');
  const auctioneerUsers = await User.find({ role: "Auctioneer" }).select('-password');
  const bidderUsers = await User.find({ role: "Bidder" }).select('-password');

  // Get monthly user growth data for charts
  const monthlyUserGrowth = await User.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          role: "$role",
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        month: "$_id.month",
        year: "$_id.year",
        role: "$_id.role",
        count: 1,
        _id: 0,
      },
    },
    {
      $sort: { year: 1, month: 1 },
    },
  ]);

  const bidders = monthlyUserGrowth.filter((user) => user.role === "Bidder");
  const auctioneers = monthlyUserGrowth.filter((user) => user.role === "Auctioneer");

  const tranformDataToMonthlyArray = (data, totalMonths = 12) => {
    const result = Array(totalMonths).fill(0);

    data.forEach((item) => {
      result[item.month - 1] = item.count;
    });

    return result;
  };

  const biddersArray = tranformDataToMonthlyArray(bidders);
  const auctioneersArray = tranformDataToMonthlyArray(auctioneers);

  res.status(200).json({
    success: true,
    biddersArray,
    auctioneersArray,
    // Add actual user objects for display
    superAdminUsers,
    auctioneerUsers,
    bidderUsers,
    // Add actual user counts
    userCounts: {
      superAdmin: superAdminCount,
      auctioneers: auctioneerCount,
      bidders: bidderCount,
      total: superAdminCount + auctioneerCount + bidderCount
    }
  });
});

export const monthlyRevenue = catchAsyncErrors(async (req, res, next) => {
  try {
    console.log("🔍 Fetching monthly revenue...");
    
    // Get all approved payment proofs with amount > 0
    const payments = await PaymentProof.aggregate([
      {
        $match: {
          status: { $regex: /^approved$/i }, // Case-insensitive match
          amount: { $gt: 0 } // Only count payments with amount > 0
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$uploadedAt" },
            year: { $year: "$uploadedAt" },
          },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    console.log("📊 Raw payment data:", payments);

    const tranformDataToMonthlyArray = (payments, totalMonths = 12) => {
      const result = Array(totalMonths).fill(0);

      payments.forEach((payment) => {
        result[payment._id.month - 1] = payment.totalAmount;
      });

      return result;
    };

    const totalMonthlyRevenue = tranformDataToMonthlyArray(payments);
    console.log("💰 Total monthly revenue array:", totalMonthlyRevenue);
    
    res.status(200).json({
      success: true,
      totalMonthlyRevenue,
      totalAmount: totalMonthlyRevenue.reduce((sum, amount) => sum + amount, 0),
      paymentCount: payments.length
    });
  } catch (error) {
    console.error("❌ Error in monthlyRevenue:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch monthly revenue",
      error: error.message
    });
  }
});

// Update user information
export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { userName, email, phone, address, role } = req.body;
  const adminId = req.user.id;

  // Validate user ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid user ID format.", 400));
  }

  // Check if user exists
  const existingUser = await User.findById(id);
  if (!existingUser) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Prevent updating Super Admin users (security measure)
  if (existingUser.role === "Super Admin" && req.user.role !== "Super Admin") {
    return next(new ErrorHandler("You cannot modify Super Admin users.", 403));
  }

  // Prevent changing users to Super Admin role (security measure)
  if (role === "Super Admin") {
    return next(new ErrorHandler("Cannot change user role to Super Admin through this interface.", 403));
  }

  // Check if email is already taken by another user
  if (email && email !== existingUser.email) {
    const emailExists = await User.findOne({ email, _id: { $ne: id } });
    if (emailExists) {
      return next(new ErrorHandler("Email already exists.", 400));
    }
  }

  // Prepare update data
  const updateData = {};
  if (userName) updateData.userName = userName;
  if (email) updateData.email = email;
  if (phone !== undefined) updateData.phone = phone;
  if (address !== undefined) updateData.address = address;
  if (role) updateData.role = role;

  // Track changes for activity log
  const changes = {};
  Object.keys(updateData).forEach(key => {
    if (existingUser[key] !== updateData[key]) {
      changes[key] = {
        from: existingUser[key],
        to: updateData[key]
      };
    }
  });

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false
    }
  ).select('-password');

  // Create activity log
  const action = Object.keys(changes).includes('role') ? 'ROLE_CHANGED' : 'USER_UPDATED';
  const description = Object.keys(changes).includes('role') 
    ? `User role changed from ${existingUser.role} to ${role}`
    : `User profile updated: ${Object.keys(changes).join(', ')}`;

  await createActivityLog(
    id,
    action,
    description,
    { changes, updatedBy: adminId },
    adminId,
    req
  );

  res.status(200).json({
    success: true,
    message: "User updated successfully.",
    user: updatedUser,
    changes
  });
});

// Delete user
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const adminId = req.user.id;

  // Validate user ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid user ID format.", 400));
  }

  // Check if user exists
  const existingUser = await User.findById(id);
  if (!existingUser) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Prevent deleting Super Admin users
  if (existingUser.role === "Super Admin") {
    return next(new ErrorHandler("Super Admin users cannot be deleted.", 403));
  }

  // Prevent self-deletion
  if (id === adminId) {
    return next(new ErrorHandler("You cannot delete your own account.", 400));
  }

  // Check if user has active auctions
  const activeAuctions = await Auction.find({ 
    auctioneer: id, 
    endTime: { $gt: new Date() },
    status: { $ne: "Ended" }
  });

  if (activeAuctions.length > 0) {
    return next(new ErrorHandler("Cannot delete user with active auctions.", 400));
  }

  // Check if user has pending payments
  const pendingPayments = await PaymentProof.find({ 
    user: id, 
    status: "Pending" 
  });

  if (pendingPayments.length > 0) {
    return next(new ErrorHandler("Cannot delete user with pending payments.", 400));
  }

  // Store user info for activity log before deletion
  const userInfo = {
    userName: existingUser.userName,
    email: existingUser.email,
    role: existingUser.role
  };

  // Delete user
  await User.findByIdAndDelete(id);

  // Create activity log
  await createActivityLog(
    id,
    'USER_DELETED',
    `User ${userInfo.userName} (${userInfo.email}) deleted`,
    { deletedUser: userInfo, deletedBy: adminId },
    adminId,
    req
  );

  res.status(200).json({
    success: true,
    message: "User deleted successfully.",
    deletedUser: userInfo
  });
});

// Get user activity logs
export const getUserActivityLogs = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { page = 1, limit = 50, action, severity, startDate, endDate } = req.query;

  // Validate user ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid user ID format.", 400));
  }

  // Check if user exists
  const userExists = await User.findById(id);
  if (!userExists) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Build query
  const query = { userId: id };
  if (action) query.action = action;
  if (severity) query.severity = severity;
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const totalLogs = await UserActivity.countDocuments(query);
  const totalPages = Math.ceil(totalLogs / parseInt(limit));

  // Get activity logs with pagination
  const activityLogs = await UserActivity.find(query)
    .populate('performedBy', 'userName email role')
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    activityLogs,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalLogs,
      hasNextPage: parseInt(page) < totalPages,
      hasPrevPage: parseInt(page) > 1
    }
  });
});

// Create user activity log (for external use)
export const createUserActivityLog = catchAsyncErrors(async (req, res, next) => {
  const { userId, action, description, details, severity = "LOW" } = req.body;
  const adminId = req.user.id;

  // Validate required fields
  if (!userId || !action || !description) {
    return next(new ErrorHandler("Missing required fields: userId, action, description", 400));
  }

  // Validate user ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ErrorHandler("Invalid user ID format.", 400));
  }

  // Check if user exists
  const userExists = await User.findById(userId);
  if (!userExists) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Create activity log
  const activityLog = await UserActivity.create({
    userId,
    action,
    description,
    details,
    performedBy: adminId,
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    severity
  });

  // Populate performer details
  await activityLog.populate('performedBy', 'userName email role');

  res.status(201).json({
    success: true,
    message: "Activity log created successfully.",
    activityLog
  });
});

// Get platform settings
export const getPlatformSettings = catchAsyncErrors(async (req, res, next) => {
  try {
    console.log("🔍 Fetching platform settings...");
    
    // Get all configuration values from database
    const configs = await Config.find();
    
    if (!configs || configs.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Platform settings not found in the database. Please run the initialization script."
      });
    }

    // Convert configs array to settings objects
    const settings = {};
    const securitySettings = {};

    configs.forEach(config => {
      if (config.category === 'general') {
        // Convert commission rate from decimal to percentage for display
        if (config.key === 'commissionRate') {
          settings[config.key] = parseFloat(config.value) * 100; // Convert 0.05 to 5.0
        } else {
          settings[config.key] = config.value;
        }
      } else if (config.category === 'security') {
        securitySettings[config.key] = config.value;
      }
    });

    console.log("📊 Fetched settings:", { settings, securitySettings });

    res.status(200).json({
      success: true,
      settings,
      securitySettings
    });
  } catch (error) {
    console.error("❌ Error fetching platform settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch platform settings",
      error: error.message
    });
  }
});

// Update platform settings
export const updatePlatformSettings = catchAsyncErrors(async (req, res, next) => {
  try {
    console.log("🔍 Updating platform settings...");
    const { settings, securitySettings } = req.body;
    
    console.log("📊 New settings:", { settings, securitySettings });
    
    // Validate commission rate (convert from percentage to decimal for storage)
    if (settings && settings.commissionRate !== undefined) {
      const commissionRate = parseFloat(settings.commissionRate) / 100; // Convert 5.0 to 0.05
      console.log("💰 Commission rate conversion:", { 
        from: settings.commissionRate, 
        to: commissionRate 
      });
      
      if (commissionRate < 0 || commissionRate > 0.2) {
        return res.status(400).json({
          success: false,
          message: "Commission rate must be between 0 and 20%"
        });
      }
      
      // Update commission rate in database
      const updatedConfig = await Config.findOneAndUpdate(
        { key: 'commissionRate' },
        { value: commissionRate, updatedBy: req.user.id },
        { new: true }
      );
      console.log("✅ Commission rate updated in database:", updatedConfig);
    }

    // Update security settings in database
    if (securitySettings) {
      if (securitySettings.sessionTimeout !== undefined) {
        if (securitySettings.sessionTimeout < 1 || securitySettings.sessionTimeout > 168) {
          return res.status(400).json({
            success: false,
            message: "Session timeout must be between 1 and 168 hours"
          });
        }
        
        await Config.findOneAndUpdate(
          { key: 'sessionTimeout' },
          { value: securitySettings.sessionTimeout, updatedBy: req.user.id },
          { new: true }
        );
      }

      if (securitySettings.maxLoginAttempts !== undefined) {
        if (securitySettings.maxLoginAttempts < 3 || securitySettings.maxLoginAttempts > 10) {
          return res.status(400).json({
            success: false,
            message: "Max login attempts must be between 3 and 10"
          });
        }
        
        await Config.findOneAndUpdate(
          { key: 'maxLoginAttempts' },
          { value: securitySettings.maxLoginAttempts, updatedBy: req.user.id },
          { new: true }
        );
      }

      if (securitySettings.passwordMinLength !== undefined) {
        if (securitySettings.passwordMinLength < 6 || securitySettings.passwordMinLength > 32) {
          return res.status(400).json({
            success: false,
            message: "Password minimum length must be between 6 and 32 characters"
          });
        }
        
        await Config.findOneAndUpdate(
          { key: 'passwordMinLength' },
          { value: securitySettings.passwordMinLength, updatedBy: req.user.id },
          { new: true }
        );
      }

      if (securitySettings.enableAuditLog !== undefined) {
        await Config.findOneAndUpdate(
          { key: 'enableAuditLog' },
          { value: securitySettings.enableAuditLog, updatedBy: req.user.id },
          { new: true }
        );
      }
    }

    console.log("✅ Platform settings updated successfully");
    
    // Return updated settings
    const updatedConfigs = await Config.find();
    const updatedSettings = {};
    const updatedSecuritySettings = {};

    updatedConfigs.forEach(config => {
      if (config.category === 'general') {
        updatedSettings[config.key] = config.key === 'commissionRate' ? 
          parseFloat(config.value) * 100 : config.value;
      } else if (config.category === 'security') {
        updatedSecuritySettings[config.key] = config.value;
      }
    });

    res.status(200).json({
      success: true,
      message: "Platform settings updated successfully",
      settings: updatedSettings,
      securitySettings: updatedSecuritySettings
    });
  } catch (error) {
    console.error("❌ Error updating platform settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update platform settings",
      error: error.message
    });
  }
});


