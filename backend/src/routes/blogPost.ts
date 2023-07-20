import { Router } from "express";
import { body, check } from "express-validator";
import {isAuth} from '../middleware/is-auth';

import {
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  deleteBlogPostById,
  updateBlogPost,
} from "../controllers/blogPostController";

const router = Router();

router.get("/posts", isAuth, getAllBlogPosts);
router.get("/posts/:id",isAuth, getBlogPostById);
router.post(
  "/posts/",isAuth,
  [body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({min: 6})
],
  createBlogPost
);
router.put("/posts/:id",isAuth,
[body("title").trim().isLength({ min: 5 }),
  body("content").trim().isLength({min: 6})
], updateBlogPost);
router.delete("/posts/:id",isAuth, deleteBlogPostById);

export default router;
