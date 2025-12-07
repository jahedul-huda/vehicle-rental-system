import express, { Request, Response } from 'express';

import initDB from './config/db.js';

import logger from './middleware/logger.js';
import { authRoutes } from './modules/auth/auth.routes';
import { bookingRoutes } from './modules/booking/booking.routes';
import { userRoutes } from './modules/user/user.routes.js';
import { vehicleRoutes } from './modules/vehicles/vehicles.routes';

// create express app
const app = express()

// initialize database
initDB()

// body parser
app.use(express.json());

// routes
app.get('/', logger, (req: Request, res: Response) => {
  res.send('Hello World!')
})

// User routes
app.use("/api/v1/users", userRoutes);

// auth routes
app.use("/api/v1/auth", authRoutes);

// Vehicle routes
app.use("/api/v1/vehicles", vehicleRoutes);

// Booking routes
app.use("/api/v1/bookings", bookingRoutes)

// not found route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method,
  });
});


export default app
