import mongoose from 'mongoose';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Auth service database connected successfully');
  } catch (error) {
    console.error('Auth service database connection error:', error);
    process.exit(1);
  }
};