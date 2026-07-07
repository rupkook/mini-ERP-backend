import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import { AppError } from '../utils/errorHandler';
import { sendResponse } from '../utils/apiResponse';
import { QueryBuilder } from '../utils/queryBuilder';

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      throw new AppError('Product image is required', 400);
    }

    const productData = {
      ...req.body,
      productImage: req.file.path,
    };

    const product = await Product.create(productData);
    sendResponse(res, 201, 'Product created successfully', product);
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const queryBuilder = new QueryBuilder(Product.find(), req.query as Record<string, string>)
      .search(['name', 'sku', 'category'])
      .filter()
      .sort()
      .paginate();

    const products = await queryBuilder.query;
    const pagination = await queryBuilder.countTotal();

    sendResponse(res, 200, 'Products fetched successfully', products, pagination);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    sendResponse(res, 200, 'Product fetched successfully', product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updateData: Record<string, unknown> = { ...req.body };

    if (req.file) {
      updateData.productImage = req.file.path;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    sendResponse(res, 200, 'Product updated successfully', product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    sendResponse(res, 200, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};
