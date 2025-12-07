import express from 'express';
import { authController } from './auth.controller';

const router = express.Router();

const { signup, signin } = authController;

// POST /api/v1/auth/signup
router.post('/signup', signup);

// POST /api/v1/auth/signin
router.post('/signin', signin);

export const authRoutes = router;
