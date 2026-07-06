import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables FIRST — before anything else
dotenv.config();

// Config
import connectDB from './config/db';

// Routes
import authRoutes from './routes/auth.routes';
import customerRoutes from './routes/customer.routes';
import dashboardRoutes from './routes/dashboard.routes';
import productRoutes from './routes/product.routes';
import saleRoutes from './routes/sale.routes';

// Middleware
import { globalErrorHandler } from './utils/errorHandler';

const app: Application = express();

// Middleware
app.use(cors({
  origin: ['https://mini-erp-frontend-one.vercel.app', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Ensure DB is connected before handling any API request
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error: any) {
    console.error('Failed to connect to MongoDB:', error);
    res.status(500).json({
      message: 'Database connection failed',
      reason: error?.message || 'Unknown error',
      hasMongoUri: !!process.env.MONGO_URI,
      uriPrefix: process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 20) + '...' : 'NOT SET',
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);

// Base route
app.get('/', (req: Request, res: Response) => {
  res.send('Mini ERP API is running');
});

// Global error handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

// Vercel serverless environment doesn't need app.listen()
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

export default app;
