import express from 'express';
import auth from '../../middleware/auth';
import { userController } from './user.controller';

const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = userController;

// ADMIN ONLY
router.get('/', auth('admin'), getAllUsers);

// ADMIN or SAME USER
router.get('/:userId', auth('admin', 'customer'), getUserById);

// ADMIN or SAME USER
router.put('/:userId', auth('admin', 'customer'), updateUser);

// ADMIN ONLY
router.delete('/:userId', auth('admin'), deleteUser);

export const userRoutes = router;
