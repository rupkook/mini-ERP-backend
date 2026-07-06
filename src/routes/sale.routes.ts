import { Router } from 'express';
import { createSale, getAllSales } from '../controllers/sale.controller';
import { protect } from '../middleware/auth';

const router = Router();

// All sales routes require authentication
router.use(protect);

// All authenticated users can create sales and view sales
router.post('/', createSale);
router.get('/', getAllSales);

export default router;
