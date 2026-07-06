"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSales = exports.createSale = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Sale_1 = __importDefault(require("../models/Sale"));
const Product_1 = __importDefault(require("../models/Product"));
const Customer_1 = __importDefault(require("../models/Customer"));
const errorHandler_1 = require("../utils/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
const createSale = async (req, res, next) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { customer: customerId, items } = req.body;
        if (!customerId) {
            throw new errorHandler_1.AppError('Customer is required', 400);
        }
        if (!items || items.length === 0) {
            throw new errorHandler_1.AppError('Sale must have at least one item', 400);
        }
        // Validate customer exists
        const customer = await Customer_1.default.findById(customerId).session(session);
        if (!customer) {
            throw new errorHandler_1.AppError('Customer not found', 404);
        }
        let grandTotal = 0;
        const saleItems = [];
        for (const item of items) {
            const product = await Product_1.default.findById(item.product).session(session);
            if (!product) {
                throw new errorHandler_1.AppError(`Product with ID ${item.product} not found`, 404);
            }
            if (product.stockQuantity < item.quantity) {
                throw new errorHandler_1.AppError(`Insufficient stock for "${product.name}". Available: ${product.stockQuantity}, Requested: ${item.quantity}`, 400);
            }
            const totalPrice = product.sellingPrice * item.quantity;
            grandTotal += totalPrice;
            saleItems.push({
                product: product._id,
                productName: product.name,
                quantity: item.quantity,
                unitPrice: product.sellingPrice,
                totalPrice,
            });
            // Reduce stock
            product.stockQuantity -= item.quantity;
            await product.save({ session });
        }
        const sale = await Sale_1.default.create([
            {
                customer: customerId,
                customerName: customer.name,
                items: saleItems,
                grandTotal,
                createdBy: req.user._id,
            },
        ], { session });
        await session.commitTransaction();
        (0, apiResponse_1.sendResponse)(res, 201, 'Sale created successfully', sale[0]);
    }
    catch (error) {
        await session.abortTransaction();
        next(error);
    }
    finally {
        session.endSession();
    }
};
exports.createSale = createSale;
const getAllSales = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sales = await Sale_1.default.find()
            .populate('customer', 'name email')
            .populate('createdBy', 'name')
            .sort('-createdAt')
            .skip(skip)
            .limit(limit);
        const total = await Sale_1.default.countDocuments();
        (0, apiResponse_1.sendResponse)(res, 200, 'Sales fetched successfully', sales, {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllSales = getAllSales;
//# sourceMappingURL=sale.controller.js.map