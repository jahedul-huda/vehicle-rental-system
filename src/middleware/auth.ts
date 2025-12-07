import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

const auth = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: No token provided",
        });
      }

      // If "Bearer <token>"
      if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
      }

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Invalid token format",
        });
      }

      // Decode token
      const decoded = jwt.verify(token, config.jwtSecret as string) as any;

      // Attach decoded JWT payload to req.user
      req.user = {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email,
        name: decoded.name,
      };

      // Check allowed roles
      if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Role not allowed",
        });
      }

      next();
    } catch (err: any) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
        error: err.message,
      });
    }
  };
};

export default auth;
