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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const getBlog_1 = require("../utils/getBlog");
const errorHandler_1 = require("../utils/errorHandler");
const router = express_1.default.Router();
const blogPath = path_1.default.resolve(__dirname, "../../blog.json");
console.log(blogPath);
router.get("/blogs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield (0, getBlog_1.getBlogs)(blogPath);
        res.status(201).json(blogs);
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(res, error, "Failed to get blogs");
    }
}));
router.get("/blogs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const blogs = yield (0, getBlog_1.getBlogs)(blogPath);
        const blog = blogs.find((blog) => blog.id === id);
        if (!blog) {
            return res.status(401).json({ message: "Blog not found" });
        }
        res.status(201).json(blog);
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(res, error, "Failed to fetch the blog");
    }
}));
exports.default = router;
