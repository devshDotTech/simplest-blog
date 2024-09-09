import express, { Request, Response } from "express";
import path from "path";
import { getBlogs } from "../utils/getBlog";
import { errorHandler } from "../utils/errorHandler";
import { Blog } from "../types/types";
import writeFile from "../utils/writeFile";
import authMiddleware from "../middleware/authMiddleware";
import currentDate from "../utils/currentDate";

const router = express.Router();
const blogPath = path.resolve(__dirname, "../../blog.json");

router.get("/blogs", async (req: Request, res: Response) => {
  try {
    const blogs = await getBlogs(blogPath);
    res.status(201).json(blogs);
  } catch (error: any) {
    errorHandler(res, error, "Failed to get blogs");
  }
});

router.get("/blogs/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const blogs = await getBlogs(blogPath);
    const blog = blogs.find((blog: Blog) => blog.id === id);
    if (!blog) {
      return res.status(401).json({ message: "Blog not found" });
    }
    console.log(blog);
    res.status(201).json(blog);
  } catch (error: any) {
    errorHandler(res, error, "Failed to fetch the blog");
  }
});

router.post("/blogs", authMiddleware, async (req: Request, res: Response) => {
  const { title, content } = req.body;
  if (!title || !content)
    return res.status(401).json({ message: "title and content are required" });
  try {
    const blogs = await getBlogs(blogPath);
    const date = currentDate();
    blogs.push({
      id: blogs.length + 1,
      title,
      content,
      creationtime: date,
    });
    await writeFile(blogPath, blogs);
    res
      .status(200)
      .json({ message: "Blog created with id:" + blogs.length + 1 });
  } catch (error: any) {
    errorHandler(res, error, "error creating new blog");
  }
});

router.patch("/blogs/:id", authMiddleware, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;
  if (!title || !content)
    return res.status(401).json({ message: "title and content are required" });
  const updatedBlog = {
    title,
    content,
    creationtime: currentDate(),
  };
  try {
    const blogs = await getBlogs(blogPath);
    const index = blogs.findIndex((blog: Blog) => blog.id === id);
    if (index === -1)
      return res.status(401).json({ message: "Blog not found or is deleted" });
    blogs[index] = { ...updatedBlog };
    await writeFile(blogPath, blogs);
    return res.status(200).json({ message: "Updated Successfully" });
  } catch (error) {
    errorHandler(res, error, "error updating blog");
  }
});

router.delete("/blogs/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blogs = await getBlogs(blogPath);

    // Parse id to a number to match with the blog id
    const filteredBlogs = blogs.filter((blog: Blog) => blog.id !== parseInt(id));

    // If the length of the filteredBlogs is the same as the original blogs, no blog was found with the provided id
    if (filteredBlogs.length === blogs.length) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Write the updated list (filteredBlogs) back to the JSON file
    await writeFile(blogPath, filteredBlogs);

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
