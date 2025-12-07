import { NextFunction, Request, Response } from 'express';

// logger middleware
const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${req.ip}\n`);
  next();
}

export default logger;
