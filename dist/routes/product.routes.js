"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
// All product routes require authentication
router.use(auth_1.protect);
// All roles can view
router.get('/', product_controller_1.getAllProducts);
router.get('/:id', product_controller_1.getProductById);
// Only Admin and Manager can create, update, delete
router.post('/', (0, auth_1.authorize)('Admin', 'Manager'), upload_1.upload.single('productImage'), product_controller_1.createProduct);
router.put('/:id', (0, auth_1.authorize)('Admin', 'Manager'), upload_1.upload.single('productImage'), product_controller_1.updateProduct);
router.delete('/:id', (0, auth_1.authorize)('Admin', 'Manager'), product_controller_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=product.routes.js.map