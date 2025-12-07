import { Request, Response } from "express";
import { userServices } from "./user.services";

const {
  getAllUsersDB,
  getUserByIdDB,
  updateUserDB,
  deleteUserDB
} = userServices;

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersDB();

    return res.json({
      success: true,
      message: users.length ? "Users retrieved successfully" : "No users found",
      data: users,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await getUserByIdDB(Number(req.params.userId));

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const updated = await updateUserDB(Number(req.params.userId), req.body);

    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      message: "User updated successfully",
      data: updated,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    await deleteUserDB(Number(req.params.userId));

    return res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const userController = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
