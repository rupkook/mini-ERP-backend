import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import Customer from '../models/Customer';
import Sale from '../models/Sale';
import { sendResponse } from '../utils/apiResponse';

export const getDashboardStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [totalProducts, totalCustomers, salesAgg, lowStockProducts, highStockProducts] = await Promise.all([
      Product.countDocuments(),
      Customer.countDocuments(),
      Sale.aggregate([
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$grandTotal' },
            count: { $sum: 1 },
          },
        },
      ]),
      Product.find({ stockQuantity: { $lt: 5 } })
        .select('name sku stockQuantity category')
        .sort('stockQuantity')
        .limit(10),
      Product.find({ stockQuantity: { $gte: 20 } })
        .select('name sku stockQuantity category')
        .sort('-stockQuantity')
        .limit(10),
    ]);

    const salesData = salesAgg[0] || { totalSales: 0, count: 0 };

    sendResponse(res, 200, 'Dashboard stats fetched successfully', {
      totalProducts,
      totalCustomers,
      totalSales: salesData.totalSales,
      totalSalesCount: salesData.count,
      lowStockProducts,
      highStockProducts,
    });
  } catch (error) {
    next(error);
  }
};
