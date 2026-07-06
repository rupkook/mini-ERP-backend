import { Request, Response, NextFunction } from 'express';
import Customer from '../models/Customer';
import { AppError } from '../utils/errorHandler';
import { sendResponse } from '../utils/apiResponse';
import { QueryBuilder } from '../utils/queryBuilder';

export const createCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customer = await Customer.create(req.body);
    sendResponse(res, 201, 'Customer created successfully', customer);
  } catch (error) {
    next(error);
  }
};

export const getAllCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const queryBuilder = new QueryBuilder(Customer.find(), req.query as Record<string, string>)
      .search(['name', 'email', 'phone'])
      .filter()
      .sort()
      .paginate();

    const customers = await queryBuilder.query;
    const pagination = await queryBuilder.countTotal();

    sendResponse(res, 200, 'Customers fetched successfully', customers, pagination);
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      throw new AppError('Customer not found', 404);
    }
    sendResponse(res, 200, 'Customer fetched successfully', customer);
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!customer) {
      throw new AppError('Customer not found', 404);
    }
    sendResponse(res, 200, 'Customer updated successfully', customer);
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      throw new AppError('Customer not found', 404);
    }
    sendResponse(res, 200, 'Customer deleted successfully');
  } catch (error) {
    next(error);
  }
};
