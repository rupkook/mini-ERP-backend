import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { protect, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// All product routes require authentication
router.use(protect);

// All roles can view
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Only Admin and Manager can create, update, delete
router.post('/', authorize('Admin', 'Manager'), upload.single('productImage'), createProduct);
router.put('/:id', authorize('Admin', 'Manager'), upload.single('productImage'), updateProduct);
router.delete('/:id', authorize('Admin', 'Manager'), deleteProduct);

export default router;
