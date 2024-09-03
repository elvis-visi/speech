import { connect } from 'mongoose';

/**
 * Establishes a connection to the MongoDB database using Mongoose
 * @async
 * @function connectDB
 * @returns {Promise<void>} A promise that resolves when the connection is established
 * @throws {Error} If the connection fails
 * 
 * @example
 * //Usage in another file
 * import connectDB from './config/database.js';
 * 
 * await connectDB();
 * //Your app logic here
 */

const connectDB = async () => {
  if (!process.env.MONGODB_URL) {
    console.error('MONGODB_URL is not defined in the environment variables');
    process.exit(1);
  }

  try {
    await connect(process.env.MONGODB_URL);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;