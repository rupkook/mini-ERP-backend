"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_controller_1 = require("../controllers/customer.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All customer routes require authentication
router.use(auth_1.protect);
// All roles can view customers
router.get('/', customer_controller_1.getAllCustomers);
router.get('/:id', customer_controller_1.getCustomerById);
// Only Admin and Manager can create, update, delete
router.post('/', (0, auth_1.authorize)('Admin', 'Manager'), customer_controller_1.createCustomer);
router.put('/:id', (0, auth_1.authorize)('Admin', 'Manager'), customer_controller_1.updateCustomer);
router.delete('/:id', (0, auth_1.authorize)('Admin', 'Manager'), customer_controller_1.deleteCustomer);
exports.default = router;
//# sourceMappingURL=customer.routes.js.map