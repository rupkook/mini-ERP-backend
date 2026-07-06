import mongoose from 'mongoose';

// Cache the connection promise to reuse across serverless invocations
let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = {
  conn: null,
  promise: null,
};

const connectDB = async (): Promise<void> => {
  // If already connected, reuse the connection
  if (cached.conn) {
    console.log('MongoDB: Using cached connection');
    return;
  }

  if (!process.env.MONGO_URI) {
    console.error('FATAL: MONGO_URI is not defined in environment variables!');
    console.error('If deployed on Vercel, add MONGO_URI in Project Settings → Environment Variables');
    throw new Error('MONGO_URI is not defined');
  }

  try {
    // If a connection attempt is already in progress, await it
    if (!cached.promise) {
      cached.promise = mongoose.connect(process.env.MONGO_URI, {
        bufferCommands: false,
      });
    }

    cached.conn = await cached.promise;
    console.log(`MongoDB Connected: ${cached.conn.connection.host}`);
  } catch (error) {
    // Reset cache so next invocation retries
    cached.promise = null;
    cached.conn = null;
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default connectDB;
