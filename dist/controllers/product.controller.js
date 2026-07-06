"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const errorHandler_1 = require("../utils/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
const queryBuilder_1 = require("../utils/queryBuilder");
const createProduct = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new errorHandler_1.AppError('Product image is required', 400);
        }
        const productData = {
            ...req.body,
            productImage: `/uploads/${req.file.filename}`,
        };
        const product = await Product_1.default.create(productData);
        (0, apiResponse_1.sendResponse)(res, 201, 'Product created successfully', product);
    }
    catch (error) {
        next(error);
    }
};
exports.createProduct = createProduct;
const getAllProducts = async (req, res, next) => {
    try {
        const queryBuilder = new queryBuilder_1.QueryBuilder(Product_1.default.find(), req.query)
            .search(['name', 'sku', 'category'])
            .filter()
            .sort()
            .paginate();
        const products = await queryBuilder.query;
        const pagination = await queryBuilder.countTotal();
        (0, apiResponse_1.sendResponse)(res, 200, 'Products fetched successfully', products, pagination);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllProducts = getAllProducts;
const getProductById = async (req, res, next) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (!product) {
            throw new errorHandler_1.AppError('Product not found', 404);
        }
        (0, apiResponse_1.sendResponse)(res, 200, 'Product fetched successfully', product);
    }
    catch (error) {
        next(error);
    }
};
exports.getProductById = getProductById;
const updateProduct = async (req, res, next) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.productImage = `/uploads/${req.file.filename}`;
        }
        const product = await Product_1.default.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            throw new errorHandler_1.AppError('Product not found', 404);
        }
        (0, apiResponse_1.sendResponse)(res, 200, 'Product updated successfully', product);
    }
    catch (error) {
        next(error);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product_1.default.findByIdAndDelete(req.params.id);
        if (!product) {
            throw new errorHandler_1.AppError('Product not found', 404);
        }
        (0, apiResponse_1.sendResponse)(res, 200, 'Product deleted successfully');
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=product.controller.js.map