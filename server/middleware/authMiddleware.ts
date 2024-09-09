import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import dotenv from "dotenv";
import { getBlogs } from "../utils/getBlog";
import path from "path";
import { Admin } from "../types/types";
import { errorHandler } from "../utils/errorHandler";

dotenv.config();
const adminPath = path.resolve(__dirname, "../../admin.json");

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });
  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = verify(token, process.env.SECRET || "");
    if (typeof decoded !== "string" && decoded.username) {
      const admins = await getBlogs(adminPath);
      const admin = admins.find(
        (admin: Admin) => admin.username === decoded.username,
      );
    }else {
      return res.status(401).json({ message: 'Invalid token'});
    }
    next();
  } catch (error: any) { 
    errorHandler(res, error, "Error while checking token");
  }
};

export default authMiddleware;
