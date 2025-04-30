import { connect } from 'mongoose';

console.log('Connection URI:', process.env.MONGODB_URI);

const dbConnect = async () => {
  try {
    console.log("Loaded URI from env:", process.env.MONGODB_URI);
    await connect(process.env.MONGODB_URI); // No need for options
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process with failure
  }
};

export default dbConnect;
