"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtOptions = exports.jwtSecret = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtSecret = process.env.SECRET || "superSecretKey";
exports.jwtSecret = jwtSecret;
const jwtOptions = {
    expiresIn: '1h',
};
exports.jwtOptions = jwtOptions;
