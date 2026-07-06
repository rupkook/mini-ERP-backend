import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Sale from '../models/Sale';
import Product from '../models/Product';
import Customer from '../models/Customer';
import { AppError } from '../utils/errorHandler';
import { sendResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth';

interface SaleItemInput {
  product: string;
  quantity: number;
}

export const createSale = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { customer: customerId, items } = req.body as { customer: string; items: SaleItemInput[] };

    if (!customerId) {
      throw new AppError('Customer is required', 400);
    }
    if (!items || items.length === 0) {
      throw new AppError('Sale must have at least one item', 400);
    }

    // Validate customer exists
    const customer = await Customer.findById(customerId).session(session);
    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    let grandTotal = 0;
    const saleItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        throw new AppError(`Product with ID ${item.product} not found`, 404);
      }

      if (product.stockQuantity < item.quantity) {
        throw new AppError(
          `Insufficient stock for "${product.name}". Available: ${product.stockQuantity}, Requested: ${item.quantity}`,
          400
        );
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

    const sale = await Sale.create(
      [
        {
          customer: customerId,
          customerName: customer.name,
          items: saleItems,
          grandTotal,
          createdBy: req.user!._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    sendResponse(res, 201, 'Sale created successfully', sale[0]);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const getAllSales = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const sales = await Sale.find()
      .populate('customer', 'name email')
      .populate('createdBy', 'name')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Sale.countDocuments();

    sendResponse(res, 200, 'Sales fetched successfully', sales, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};
