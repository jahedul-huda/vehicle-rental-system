import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../../config/db'; // keep consistent with your project structure
import config from '../../config/index';

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
};

const registerUserDB = async (payload: RegisterPayload) => {
  const { name, email, password, phone, role } = payload;

  // Normalize / sanitize
  const normalizedEmail = String(email).trim().toLowerCase();
  const userRole = role ? String(role).trim().toLowerCase() : 'customer';

  // Validate role
  if (!['admin', 'customer'].includes(userRole)) {
    throw new Error("Invalid role. Allowed values: 'admin', 'customer'");
  }

  // Check email uniqueness
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
  if (existing.rows.length > 0) {
    // throwing so controller will return 500; you may change to return a custom error code later
    throw new Error('Email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user
  const insertQuery = `
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role, created_at
  `;
  const values = [name, normalizedEmail, hashedPassword, phone, userRole];

  const result = await pool.query(insertQuery, values);
  const user = result.rows[0];

  // Return user (no token on sign up by spec; but many APIs also return token - if you want token remove the comment)
  // If you want to return token on signup, generate JWT here same as login
  return { user };
};

const loginUserDB = async (email: string, password: string) => {
  const normalizedEmail = String(email).trim().toLowerCase();

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);

  if (result.rows.length === 0) return null;

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  // Build token payload (include id, name, email, phone, role)
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  const token = jwt.sign(payload, config.jwtSecret as string, {
    expiresIn: '7d',
  });

  // Return token + safe user object (no password)
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  return { token, user: safeUser };
};

export const authServices = {
  registerUserDB,
  loginUserDB,
};
