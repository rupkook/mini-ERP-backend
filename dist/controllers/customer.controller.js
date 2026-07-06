"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.getCustomerById = exports.getAllCustomers = exports.createCustomer = void 0;
const Customer_1 = __importDefault(require("../models/Customer"));
const errorHandler_1 = require("../utils/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
const queryBuilder_1 = require("../utils/queryBuilder");
const createCustomer = async (req, res, next) => {
    try {
        const customer = await Customer_1.default.create(req.body);
        (0, apiResponse_1.sendResponse)(res, 201, 'Customer created successfully', customer);
    }
    catch (error) {
        next(error);
    }
};
exports.createCustomer = createCustomer;
const getAllCustomers = async (req, res, next) => {
    try {
        const queryBuilder = new queryBuilder_1.QueryBuilder(Customer_1.default.find(), req.query)
            .search(['name', 'email', 'phone'])
            .filter()
            .sort()
            .paginate();
        const customers = await queryBuilder.query;
        const pagination = await queryBuilder.countTotal();
        (0, apiResponse_1.sendResponse)(res, 200, 'Customers fetched successfully', customers, pagination);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllCustomers = getAllCustomers;
const getCustomerById = async (req, res, next) => {
    try {
        const customer = await Customer_1.default.findById(req.params.id);
        if (!customer) {
            throw new errorHandler_1.AppError('Customer not found', 404);
        }
        (0, apiResponse_1.sendResponse)(res, 200, 'Customer fetched successfully', customer);
    }
    catch (error) {
        next(error);
    }
};
exports.getCustomerById = getCustomerById;
const updateCustomer = async (req, res, next) => {
    try {
        const customer = await Customer_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!customer) {
            throw new errorHandler_1.AppError('Customer not found', 404);
        }
        (0, apiResponse_1.sendResponse)(res, 200, 'Customer updated successfully', customer);
    }
    catch (error) {
        next(error);
    }
};
exports.updateCustomer = updateCustomer;
const deleteCustomer = async (req, res, next) => {
    try {
        const customer = await Customer_1.default.findByIdAndDelete(req.params.id);
        if (!customer) {
            throw new errorHandler_1.AppError('Customer not found', 404);
        }
        (0, apiResponse_1.sendResponse)(res, 200, 'Customer deleted successfully');
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCustomer = deleteCustomer;
//# sourceMappingURL=customer.controller.js.map