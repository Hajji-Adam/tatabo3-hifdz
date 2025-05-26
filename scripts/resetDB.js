const mongoose = require('mongoose');
const User = require('./models/User');
const ar = require('./utils/ar');

// Load env variables
require('dotenv').config();

const resetDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear all users
    await User.deleteMany({});
    console.log('🗑️ All users deleted');

    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  } catch (err) {
    console.error('❌ Error resetting database:', err.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

resetDatabase();