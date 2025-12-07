import { pool } from '../../config/db';

const createVehicleDB = async (data: any) => {
  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [
      data.vehicle_name,
      data.type,
      data.registration_number,
      data.daily_rent_price,
      data.availability_status,
    ]
  );
  return result.rows[0];
};

const getAllVehiclesDB = async () => {
  const result = await pool.query(`SELECT * FROM vehicles ORDER BY id ASC`);
  return result.rows;
};

const getVehicleByIdDB = async (id: number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
  return result.rows[0];
};

const updateVehicleDB = async (id: number, payload: any) => {
  const fields = [];
  const values = [];
  let i = 1;

  for (const key in payload) {
    fields.push(`${key}=$${i}`);
    values.push(payload[key]);
    i++;
  }

  const result = await pool.query(
    `UPDATE vehicles SET ${fields.join(',')} WHERE id=$${i} RETURNING *`,
    [...values, id]
  );
  return result.rows[0];
};

// 🚫 Prevent delete if active booking exists
const deleteVehicleDB = async (id: number) => {
  const check = await pool.query(
    `SELECT id FROM bookings WHERE vehicle_id=$1 AND status='active'`,
    [id]
  );

  if (check.rows.length) {
    throw new Error("Vehicle has active booking");
  }

  await pool.query(`DELETE FROM vehicles WHERE id=$1`, [id]);
};

export const vehicleServices = {
  createVehicleDB,
  getAllVehiclesDB,
  getVehicleByIdDB,
  updateVehicleDB,
  deleteVehicleDB,
};
