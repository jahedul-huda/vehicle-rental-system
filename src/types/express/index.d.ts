import "express";

declare global {
  namespace Express {
    interface UserPayload {
      id: string | number;
      role: "admin" | "customer";
      email: string;
      name: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}
