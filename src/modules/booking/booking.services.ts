import { pool } from '../../config/db';

const createBookingDB = async (data:any, user:any) => {
  const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [data.vehicle_id]);
  if (!vehicle.rows[0]) throw new Error("Vehicle not found");

  if (vehicle.rows[0].availability_status === 'booked') {
    throw new Error("Vehicle already booked");
  }

  const days =
    (new Date(data.rent_end_date).getTime() -
      new Date(data.rent_start_date).getTime()) /
    (1000 * 60 * 60 * 24);

  const total_price = vehicle.rows[0].daily_rent_price * days;

  const booking = await pool.query(
    `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1,$2,$3,$4,$5,'active') RETURNING *`,
    [data.customer_id, data.vehicle_id, data.rent_start_date, data.rent_end_date, total_price]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [data.vehicle_id]
  );

  return booking.rows[0];
};

const getBookingsDB = async (user:any) => {
  if (user.role === 'admin') {
    const result = await pool.query(`SELECT * FROM bookings`);
    return result.rows;
  } else {
    const result = await pool.query(
      `SELECT * FROM bookings WHERE customer_id=$1`,
      [user.id]
    );
    return result.rows;
  }
};

// Cancel / Return Logic
const updateBookingStatusDB = async (id:number, status:string) => {
  const booking = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [id]);

  if (!booking.rows[0]) throw new Error("Booking not found");

  await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2`, [status, id]);

  if (status !== 'active') {
    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [booking.rows[0].vehicle_id]
    );
  }

  return { ...booking.rows[0], status };
};

export const bookingServices = {
  createBookingDB,
  getBookingsDB,
  updateBookingStatusDB,
};
