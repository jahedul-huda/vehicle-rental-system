import express from 'express';
import auth from '../../middleware/auth';
import { vehicleController } from './vehicles.controller';

const router = express.Router();
const {createVehicle, getAllVehicles, getVehicleById, updateVehicle, deleteVehicle} = vehicleController;

router.post('/', auth('admin'), createVehicle);
router.get('/', getAllVehicles);
router.get('/:vehicleId', getVehicleById);
router.put('/:vehicleId', auth('admin'), updateVehicle);
router.delete('/:vehicleId', auth('admin'), deleteVehicle);

export const vehicleRoutes = router;
