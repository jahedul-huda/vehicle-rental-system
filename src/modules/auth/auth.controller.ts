import { Request, Response } from 'express';
import { authServices } from './auth.services';

const { registerUserDB, loginUserDB } = authServices;

/**
 * POST /api/v1/auth/signup
 * Register new user
 */
const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Basic validation (server-side)
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, password, phone',
      });
    }

    if (typeof password === 'string' && password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    const result = await registerUserDB({
      name,
      email,
      password,
      phone,
      role,
    });

    // return success (201)
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result.user,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    // if the service throws a known 400-level error, it should throw an Error with message
    // you can refine this to add custom error types later
    return res.status(500).json({
      success: false,
      message: errorMessage,
      errors: err,
    });
  }
};

/**
 * POST /api/v1/auth/signin
 * Login and return JWT + user
 */
const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email and password',
      });
    }

    const result = await loginUserDB(email, password);

    if (!result) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return res.status(500).json({
      success: false,
      message: errorMessage,
      errors: err,
    });
  }
};

export const authController = {
  signup,
  signin,
};
