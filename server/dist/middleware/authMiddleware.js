"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
const getBlog_1 = require("../utils/getBlog");
const path_1 = __importDefault(require("path"));
const errorHandler_1 = require("../utils/errorHandler");
dotenv_1.default.config();
const adminPath = path_1.default.resolve(__dirname, "../../admin.json");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.header("Authorization");
    if (!authHeader)
        return res.status(401).json({ message: "No token provided" });
    const token = authHeader.replace("Bearer ", "");
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, process.env.SECRET || "");
        if (typeof decoded !== "string" && decoded.username) {
            const admins = yield (0, getBlog_1.getBlogs)(adminPath);
            const admin = admins.find((admin) => admin.username === decoded.username);
        }
        else {
            return res.status(401).json({ message: 'Invalid token' });
        }
        next();
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(res, error, "Error while checking token");
    }
});
exports.default = authMiddleware;
