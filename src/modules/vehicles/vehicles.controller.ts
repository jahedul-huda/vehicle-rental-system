import { Request, Response } from "express";
import { vehicleServices } from "./vehicles.services";

const {
  createVehicleDB,
  getAllVehiclesDB,
  getVehicleByIdDB,
  updateVehicleDB,
  deleteVehicleDB,
} = vehicleServices;

const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await createVehicleDB(req.body);
    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (err:any) {
    return res.status(400).json({ success:false, message:err.message });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  const vehicles = await getAllVehiclesDB();
  return res.json({
    success: true,
    message: vehicles.length ? "Vehicles retrieved successfully" : "No vehicles found",
    data: vehicles,
  });
};

const getVehicleById = async (req: Request, res: Response) => {
  const vehicle = await getVehicleByIdDB(Number(req.params.vehicleId));
  if (!vehicle) return res.status(404).json({ success:false, message:"Vehicle not found" });

  return res.json({
    success:true,
    message:"Vehicle retrieved successfully",
    data: vehicle,
  });
};

const updateVehicle = async (req: Request, res: Response) => {
  const updated = await updateVehicleDB(Number(req.params.vehicleId), req.body);
  return res.json({
    success:true,
    message:"Vehicle updated successfully",
    data: updated,
  });
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    await deleteVehicleDB(Number(req.params.vehicleId));
    res.json({
      success:true,
      message:"Vehicle deleted successfully",
    });
  } catch(err:any) {
    res.status(400).json({ success:false, message:err.message });
  }
};

export const vehicleController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
