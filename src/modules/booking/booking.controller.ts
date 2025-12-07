import { Request, Response } from "express";
import { bookingServices } from "./booking.services";

const {
  createBookingDB,
  getBookingsDB,
  updateBookingStatusDB
} = bookingServices;

const createBooking = async (req: Request, res: Response) => {
  try {
    const booking = await createBookingDB(req.body, req.user);
    return res.status(201).json({
      success:true,
      message:"Booking created successfully",
      data: booking,
    });
  } catch(err:any) {
    return res.status(400).json({ success:false, message:err.message });
  }
};

const getBookings = async (req: Request, res: Response) => {
  const bookings = await getBookingsDB(req.user);

  return res.json({
    success:true,
    message:"Bookings retrieved successfully",
    data: bookings,
  });
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const updated = await updateBookingStatusDB(Number(req.params.bookingId), req.body.status);

    return res.json({
      success:true,
      message:`Booking ${req.body.status} successfully`,
      data: updated,
    });
  } catch(err:any) {
    return res.status(400).json({ success:false, message:err.message });
  }
};

export const bookingController = {
  createBooking,
  getBookings,
  updateBooking,
};
