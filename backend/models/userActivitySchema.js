import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      "USER_CREATED",
      "USER_UPDATED", 
      "USER_DELETED",
      "ROLE_CHANGED",
      "PROFILE_UPDATED",
      "LOGIN",
      "LOGOUT",
      "PASSWORD_CHANGED",
      "ACCOUNT_SUSPENDED",
      "ACCOUNT_ACTIVATED",
      "PERMISSION_GRANTED",
      "PERMISSION_REVOKED"
    ]
  },
  description: {
    type: String,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  severity: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    default: "LOW"
  },
  status: {
    type: String,
    enum: ["SUCCESS", "FAILED", "PENDING"],
    default: "SUCCESS"
  }
}, {
  timestamps: true
});

// Indexes for better query performance
userActivitySchema.index({ userId: 1, timestamp: -1 });
userActivitySchema.index({ action: 1, timestamp: -1 });
userActivitySchema.index({ performedBy: 1, timestamp: -1 });
userActivitySchema.index({ severity: 1, timestamp: -1 });

// Virtual for formatted timestamp
userActivitySchema.virtual('formattedTimestamp').get(function() {
  return this.timestamp.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
});

// Ensure virtual fields are serialized
userActivitySchema.set('toJSON', { virtuals: true });
userActivitySchema.set('toObject', { virtuals: true });

export const UserActivity = mongoose.model("UserActivity", userActivitySchema);
