"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const Customer_1 = __importDefault(require("../models/Customer"));
const Sale_1 = __importDefault(require("../models/Sale"));
const apiResponse_1 = require("../utils/apiResponse");
const getDashboardStats = async (_req, res, next) => {
    try {
        const [totalProducts, totalCustomers, salesAgg, lowStockProducts, highStockProducts] = await Promise.all([
            Product_1.default.countDocuments(),
            Customer_1.default.countDocuments(),
            Sale_1.default.aggregate([
                {
                    $group: {
                        _id: null,
                        totalSales: { $sum: '$grandTotal' },
                        count: { $sum: 1 },
                    },
                },
            ]),
            Product_1.default.find({ stockQuantity: { $lt: 5 } })
                .select('name sku stockQuantity category')
                .sort('stockQuantity')
                .limit(10),
            Product_1.default.find({ stockQuantity: { $gte: 20 } })
                .select('name sku stockQuantity category')
                .sort('-stockQuantity')
                .limit(10),
        ]);
        const salesData = salesAgg[0] || { totalSales: 0, count: 0 };
        (0, apiResponse_1.sendResponse)(res, 200, 'Dashboard stats fetched successfully', {
            totalProducts,
            totalCustomers,
            totalSales: salesData.totalSales,
            totalSalesCount: salesData.count,
            lowStockProducts,
            highStockProducts,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=dashboard.controller.js.map