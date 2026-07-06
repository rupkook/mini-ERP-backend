import { Router } from 'express';
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customer.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// All customer routes require authentication
router.use(protect);

// All roles can view customers
router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);

// Only Admin and Manager can create, update, delete
router.post('/', authorize('Admin', 'Manager'), createCustomer);
router.put('/:id', authorize('Admin', 'Manager'), updateCustomer);
router.delete('/:id', authorize('Admin', 'Manager'), deleteCustomer);

export default router;
