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
const writeFile_1 = __importDefault(require("../utils/writeFile"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const currentDate_1 = __importDefault(require("../utils/currentDate"));
const router = express_1.default.Router();
const blogPath = path_1.default.resolve(__dirname, "../../blog.json");
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
        console.log(blog);
        res.status(201).json(blog);
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(res, error, "Failed to fetch the blog");
    }
}));
router.post("/blogs", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    if (!title || !content)
        return res.status(401).json({ message: "title and content are required" });
    try {
        const blogs = yield (0, getBlog_1.getBlogs)(blogPath);
        const date = (0, currentDate_1.default)();
        blogs.push({
            id: blogs.length + 1,
            title,
            content,
            creationtime: date,
        });
        yield (0, writeFile_1.default)(blogPath, blogs);
        res
            .status(200)
            .json({ message: "Blog created with id:" + blogs.length + 1 });
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(res, error, "error creating new blog");
    }
}));
router.patch("/blogs/:id", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;
    if (!title || !content)
        return res.status(401).json({ message: "title and content are required" });
    const updatedBlog = {
        title,
        content,
        creationtime: (0, currentDate_1.default)(),
    };
    try {
        const blogs = yield (0, getBlog_1.getBlogs)(blogPath);
        const index = blogs.findIndex((blog) => blog.id === id);
        if (index === -1)
            return res.status(401).json({ message: "Blog not found or is deleted" });
        blogs[index] = Object.assign({}, updatedBlog);
        yield (0, writeFile_1.default)(blogPath, blogs);
        return res.status(200).json({ message: "Updated Successfully" });
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(res, error, "error updating blog");
    }
}));
router.delete("/blogs/:id", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const blogs = yield (0, getBlog_1.getBlogs)(blogPath);
        // Parse id to a number to match with the blog id
        const filteredBlogs = blogs.filter((blog) => blog.id !== parseInt(id));
        // If the length of the filteredBlogs is the same as the original blogs, no blog was found with the provided id
        if (filteredBlogs.length === blogs.length) {
            return res.status(404).json({ message: "Blog not found" });
        }
        // Write the updated list (filteredBlogs) back to the JSON file
        yield (0, writeFile_1.default)(blogPath, filteredBlogs);
        return res.status(200).json({ message: "Blog deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting blog:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.default = router;
