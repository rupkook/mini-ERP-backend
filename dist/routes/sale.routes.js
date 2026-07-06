"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sale_controller_1 = require("../controllers/sale.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All sales routes require authentication
router.use(auth_1.protect);
// All authenticated users can create sales and view sales
router.post('/', sale_controller_1.createSale);
router.get('/', sale_controller_1.getAllSales);
exports.default = router;
//# sourceMappingURL=sale.routes.js.map