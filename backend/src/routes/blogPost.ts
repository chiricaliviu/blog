import { Router } from "express";
import { body, check } from "express-validator";

import {
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  deleteBlogPostById,
  updateBlogPost,
} from "../controllers/blogPostController";

const router = Router();

router.get("/posts", getAllBlogPosts);
router.get("/posts/:id", getBlogPostById);
router.post(
  "/posts/",
  [body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({min: 6})
],
  createBlogPost
);
router.put("/posts/", updateBlogPost);
router.delete("/posts/:id", deleteBlogPostById);

export default router;
