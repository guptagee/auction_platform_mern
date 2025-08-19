import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    enum: ['commissionRate', 'sessionTimeout', 'maxLoginAttempts', 'passwordMinLength', 'enableAuditLog']
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['general', 'security']
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for better performance
configSchema.index({ key: 1 });
configSchema.index({ category: 1 });

const Config = mongoose.model('Config', configSchema);

export default Config;
