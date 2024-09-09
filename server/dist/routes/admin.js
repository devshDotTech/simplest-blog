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
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const getBlog_1 = require("../utils/getBlog");
const hashPass_1 = __importDefault(require("../utils/hashPass"));
const errorHandler_1 = require("../utils/errorHandler");
const writeFile_1 = __importDefault(require("../utils/writeFile"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
const jwt_1 = require("../config/jwt");
dotenv_1.default.config();
const router = (0, express_1.Router)();
const adminPath = path_1.default.resolve(__dirname, "../../admin.json");
router.post("/admin/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    console.log(username, password);
    if (!username || !password)
        return res
            .status(401)
            .json({ message: "Username and password is required" });
    try {
        const admins = yield (0, getBlog_1.getBlogs)(adminPath);
        const admin = admins.find((admin) => admin.username === username);
        if (!admin)
            return res.status(401).json({ message: "Username is incorrect" });
        console.log(password, admin);
        const isMatch = yield (0, bcrypt_1.compare)(password, admin.password);
        if (!isMatch)
            return res.status(403).json({ message: "Invalid Password" });
        console.log("user found");
        const token = (0, jsonwebtoken_1.sign)({ username: admin.username, role: 'admin' }, jwt_1.jwtSecret, jwt_1.jwtOptions);
        res.status(201).json(token);
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(res, error, "error logging in admin");
    }
}));
router.post("/admin/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('route hit');
    const { username, password } = req.body;
    console.log(username, password);
    if (!username || !password)
        return res
            .status(401)
            .json({ message: "Username and password is required" });
    try {
        const admins = yield (0, getBlog_1.getBlogs)(adminPath);
        const hashedPass = yield (0, hashPass_1.default)(password);
        const admin = { username, password: hashedPass };
        admins.push(admin);
        const token = (0, jsonwebtoken_1.sign)({ username: admin.username, role: 'admin' }, jwt_1.jwtSecret, jwt_1.jwtOptions);
        yield (0, writeFile_1.default)(adminPath, admins);
        res.status(200).json({ message: "Admin created successfully", token });
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(res, error, "Error creating admin");
    }
}));
exports.default = router;
