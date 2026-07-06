"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables FIRST — before anything else
dotenv_1.default.config();
// Config
const db_1 = __importDefault(require("./config/db"));
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const customer_routes_1 = __importDefault(require("./routes/customer.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const sale_routes_1 = __importDefault(require("./routes/sale.routes"));
// Middleware
const errorHandler_1 = require("./utils/errorHandler");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: ['https://mini-erp-frontend-one.vercel.app', 'http://localhost:5173'],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Static files (for uploads)
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Ensure DB is connected before handling any API request
app.use(async (req, res, next) => {
    try {
        await (0, db_1.default)();
        next();
    }
    catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        res.status(500).json({ message: 'Database connection failed' });
    }
});
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/customers', customer_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/sales', sale_routes_1.default);
// Base route
app.get('/', (req, res) => {
    res.send('Mini ERP API is running');
});
// Global error handler
app.use(errorHandler_1.globalErrorHandler);
const PORT = process.env.PORT || 5000;
// Vercel serverless environment doesn't need app.listen()
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
}
exports.default = app;
//# sourceMappingURL=server.js.map