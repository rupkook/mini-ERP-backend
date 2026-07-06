import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import connectDB from '../config/db';

dotenv.config();

const users = [
  { name: 'Admin User', email: 'admin@erp.com', password: 'admin', role: 'Admin' as 'Admin' },
  { name: 'Manager User', email: 'manager@erp.com', password: 'admin', role: 'Manager' as 'Manager' },
  { name: 'Employee User', email: 'employee@erp.com', password: 'admin', role: 'Employee' as 'Employee' }
];

const seedData = async () => {
  try {
    await connectDB();
    
    // Clean up existing users to start fresh
    await User.deleteMany({});
    
    // Create users one by one to trigger the password hashing pre('save') middleware
    for (const u of users) {
      await User.create(u);
    }
    
    console.log('Database seeded with demo users successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
