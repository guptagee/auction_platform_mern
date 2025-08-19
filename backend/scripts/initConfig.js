import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Config from '../models/configSchema.js';

// Load environment variables
dotenv.config({ path: './config/config.env' });

const initializeConfig = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "MERN_AUCTION_PLATFORM"
    });
    console.log('✅ Connected to MongoDB');

    // Default configuration values
    const defaultConfigs = [
      {
        key: 'commissionRate',
        value: parseFloat(process.env.COMMISSION_RATE) || 0.05,
        description: 'Commission rate for successful auctions (0.05 = 5%)',
        category: 'general'
      },
      {
        key: 'sessionTimeout',
        value: 24,
        description: 'Session timeout in hours',
        category: 'security'
      },
      {
        key: 'maxLoginAttempts',
        value: 5,
        description: 'Maximum failed login attempts before lockout',
        category: 'security'
      },
      {
        key: 'passwordMinLength',
        value: 8,
        description: 'Minimum password length requirement',
        category: 'security'
      },
      {
        key: 'enableAuditLog',
        value: true,
        description: 'Enable audit logging for admin actions',
        category: 'security'
      }
    ];

    // Insert or update each configuration
    for (const config of defaultConfigs) {
      await Config.findOneAndUpdate(
        { key: config.key },
        { ...config, updatedBy: null }, // No user ID for initial setup
        { upsert: true, new: true }
      );
      console.log(`✅ ${config.key}: ${config.value}`);
    }

    console.log('🎉 Configuration initialization completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing configuration:', error);
    process.exit(1);
  }
};

// Run the initialization
initializeConfig();
