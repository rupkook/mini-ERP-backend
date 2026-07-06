"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Cache the connection promise to reuse across serverless invocations
let cached = {
    conn: null,
    promise: null,
};
const connectDB = async () => {
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
            cached.promise = mongoose_1.default.connect(process.env.MONGO_URI, {
                bufferCommands: false,
            });
        }
        cached.conn = await cached.promise;
        console.log(`MongoDB Connected: ${cached.conn.connection.host}`);
    }
    catch (error) {
        // Reset cache so next invocation retries
        cached.promise = null;
        cached.conn = null;
        console.error('MongoDB connection error:', error);
        throw error;
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map