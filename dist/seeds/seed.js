"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
const db_1 = __importDefault(require("../config/db"));
dotenv_1.default.config();
const users = [
    { name: 'Admin User', email: 'admin@erp.com', password: 'admin', role: 'Admin' },
    { name: 'Manager User', email: 'manager@erp.com', password: 'admin', role: 'Manager' },
    { name: 'Employee User', email: 'employee@erp.com', password: 'admin', role: 'Employee' }
];
const seedData = async () => {
    try {
        await (0, db_1.default)();
        // Clean up existing users to start fresh
        await User_1.default.deleteMany({});
        // Create users one by one to trigger the password hashing pre('save') middleware
        for (const u of users) {
            await User_1.default.create(u);
        }
        console.log('Database seeded with demo users successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};
seedData();
//# sourceMappingURL=seed.js.map