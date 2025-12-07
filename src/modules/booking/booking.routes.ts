import express from 'express';
import auth from '../../middleware/auth';
import { bookingController } from './booking.controller';

const router = express.Router();
const {
  createBooking,
  getBookings,
  updateBooking,
} = bookingController;

router.post('/', auth('admin','customer'),createBooking);
router.get('/', auth('admin','customer'),getBookings);
router.put('/:bookingId', auth('admin','customer'),updateBooking);

export const bookingRoutes = router;
