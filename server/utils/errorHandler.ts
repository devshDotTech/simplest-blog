import { Response } from "express";

export const errorHandler = (res: Response, error: any, message: string) => {
  console.error(`[error]: ${message}`, error);
  res.status(500).json({ message: "Internal server Error" });
};
