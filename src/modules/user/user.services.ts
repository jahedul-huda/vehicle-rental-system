import { pool } from '../../config/db';

const getAllUsersDB = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users ORDER BY id ASC`
  );
  return result.rows;
};

const getUserByIdDB = async (id: number) => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

const updateUserDB = async (id: number, payload: any) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in payload) {
    fields.push(`${key} = $${index}`);
    values.push(payload[key]);
    index++;
  }

  const result = await pool.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, name, email, phone, role`,
    [...values, id]
  );

  return result.rows[0];
};

// PREVENT DELETE IF ACTIVE BOOKINGS EXIST
const deleteUserDB = async (id: number) => {
  const bookingCheck = await pool.query(
    `SELECT id FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [id]
  );

  if (bookingCheck.rows.length) {
    throw new Error('User has active bookings');
  }

  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING id`,
    [id]
  );

  return result.rows[0];
};

export const userServices = {
  getAllUsersDB,
  getUserByIdDB,
  updateUserDB,
  deleteUserDB,
};
