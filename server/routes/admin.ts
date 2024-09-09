import { Request, Response, Router } from "express";
import path from "path";
import { getBlogs as getFile } from "../utils/getBlog";
import hashPass from "../utils/hashPass";
import { errorHandler } from "../utils/errorHandler";
import writeFile from "../utils/writeFile";
import { Admin } from "../types/types";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import dotenv from 'dotenv';
import { jwtOptions, jwtSecret } from "../config/jwt";


dotenv.config();
const router = Router();
const adminPath = path.resolve(__dirname, "../../admin.json");

router.post("/admin/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log(username, password)
  if (!username || !password)
    return res
      .status(401)
      .json({ message: "Username and password is required" });
  try {
    const admins = await getFile(adminPath);
    const admin = admins.find((admin: Admin) => admin.username === username)
    if (!admin) return res.status(401).json({ message: "Username is incorrect" });
    console.log(password, admin);
    const isMatch = await compare(password, admin.password);
    if (!isMatch) return res.status(403).json( { message: "Invalid Password"});
    console.log("user found")
    const token = sign(
      { username: admin.username, role: 'admin' }, 
      jwtSecret, 
      jwtOptions,
    );
    res.status(201).json(token);
    
  } catch (error: any) { 
    errorHandler(res, error, "error logging in admin");
  }
});

router.post("/admin/signup", async (req: Request, res: Response) => {
  console.log('route hit')
  const { username, password } = req.body;
  console.log(username, password)
  if (!username || !password)
    return res
      .status(401)
      .json({ message: "Username and password is required" });
  try {
    const admins = await getFile(adminPath);
    const hashedPass = await hashPass(password);
    const admin = { username, password: hashedPass };
    admins.push(admin);
    const token = sign(
      { username: admin.username, role: 'admin'},
      jwtSecret,
      jwtOptions,
    )
    await writeFile(adminPath, admins);
    res.status(200).json({ message: "Admin created successfully", token });
  } catch (error: any) {
    errorHandler(res, error, "Error creating admin");
  }
});

export default router;
