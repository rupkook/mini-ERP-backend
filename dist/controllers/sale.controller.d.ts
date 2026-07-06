import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createSale: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllSales: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=sale.controller.d.ts.map