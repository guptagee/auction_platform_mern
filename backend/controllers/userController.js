import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";
import { sendWelcomeEmail } from "../utils/sendEmail.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Profile Image Required.", 400));
  }

  const { profileImage } = req.files;

  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(profileImage.mimetype)) {
    return next(new ErrorHandler("File format not supported.", 400));
  }

  const {
    userName,
    email,
    password,
    phone,
    address,
    role,
    bankAccountNumber,
    bankAccountName,
    bankName,
    upiId,
    paypalEmail,
  } = req.body;

  if (!userName || !email || !phone || !password || !address || !role) {
    return next(new ErrorHandler("Please fill full form.", 400));
  }
  
  // Prevent Super Admin creation through registration
  if (role === "Super Admin") {
    return next(new ErrorHandler("Super Admin role cannot be created through registration.", 403));
  }
  
  if (role === "Auctioneer") {
    if (!bankAccountName || !bankAccountNumber || !bankName) {
      return next(
        new ErrorHandler("Please provide your full bank details.", 400)
      );
    }
    if (!upiId) {
      return next(
        new ErrorHandler("Please provide your UPI ID.", 400)
      );
    }
    if (!paypalEmail) {
      return next(new ErrorHandler("Please provide your paypal email.", 400));
    }
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already registered.", 400));
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    profileImage.tempFilePath,
    {
      folder: "MERN_AUCTION_PLATFORM_USERS",
    }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary error:",
      cloudinaryResponse.error || "Unknown cloudinary error."
    );
    return next(
      new ErrorHandler("Failed to upload profile image to cloudinary.", 500)
    );
  }
  const user = await User.create({
    userName,
    email,
    password,
    phone,
    address,
    role,
    profileImage: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    paymentMethods: {
      bankTransfer: {
        bankAccountNumber,
        bankAccountName,
        bankName,
      },
      upi: {
        upiId,
      },
      paypal: {
        paypalEmail,
      },
    },
  });
  generateToken(user, "User Registered.", 201, res);
  await sendWelcomeEmail(user.email, user.userName);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  
  console.log("🔍 Login request received:");
  console.log("Request body:", req.body);
  console.log("Email:", email);
  console.log("Password:", password);
  console.log("Email type:", typeof email);
  console.log("Password type:", typeof password);
  
  if (!email || !password) {
    console.log("❌ Missing email or password");
    return next(new ErrorHandler("Please fill full form."));
  }
  
  console.log("🔍 Looking for user with email:", email);
  const user = await User.findOne({ email }).select("+password");
  
  if (!user) {
    console.log("❌ User not found with email:", email);
    return next(new ErrorHandler("Invalid credentials.", 400));
  }
  
  console.log("✅ User found:", user.email, "Role:", user.role);
  
  const isPasswordMatch = await user.comparePassword(password);
  console.log("Password match result:", isPasswordMatch);
  
  if (!isPasswordMatch) {
    console.log("❌ Password doesn't match");
    return next(new ErrorHandler("Invalid credentials.", 400));
  }
  
  console.log("🎉 Login successful for:", user.email);
  generateToken(user, "Login successfully.", 200, res);
});

export const getProfile = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const {
    phone,
    address,
    bankName,
    bankAccountNumber,
    bankAccountName,
    upiId,
    paypalEmail,
  } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Update basic fields
  if (phone) user.phone = phone;
  if (address) user.address = address;

  // Update payment methods if user is an auctioneer
  if (user.role === "Auctioneer") {
    if (bankName) user.paymentMethods.bankTransfer.bankName = bankName;
    if (bankAccountNumber) user.paymentMethods.bankTransfer.bankAccountNumber = bankAccountNumber;
    if (bankAccountName) user.paymentMethods.bankTransfer.bankAccountName = bankAccountName;
    if (upiId) user.paymentMethods.upi.upiId = upiId;
    if (paypalEmail) user.paymentMethods.paypal.paypalEmail = paypalEmail;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

export const fetchLeaderboard = catchAsyncErrors(async (req, res, next) => {
  const leaderboard = await User.find({ role: "Bidder" })
    .select("userName profileImage moneySpent auctionsWon")
    .sort({ moneySpent: -1 })
    .limit(100);

  res.status(200).json({
    success: true,
    leaderboard,
  });
});

export const testEmail = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, userName = 'Test User' } = req.body;
    
    if (!email) {
      return next(new ErrorHandler("Email is required.", 400));
    }

    // Send test welcome email
    await sendWelcomeEmail(email, userName);
    
    res.status(200).json({
      success: true,
      message: "Test email sent successfully!",
      email: email
    });
  } catch (error) {
    console.error('❌ Test email failed:', error);
    return next(new ErrorHandler("Failed to send test email.", 500));
  }
});
