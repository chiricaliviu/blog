import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator/src/validation-result";
const BlogPost = require ('../models/blogPost');

export const getAllBlogPosts = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    
  res
    .status(201)
    .json({
      posts: [
        {
          title: "FirstPost",
          content: "This is the first post",
          imageUrl: "images/duck.jpg",
          author:' test',
          createdAt: 'test',
          comments: 'test'
        },
      ],
    });
};

export const getBlogPostById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const createBlogPost = (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validation failed, entered data is incorrect.',
            errors: errors.array()
        })
    }
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.body.imageUrl;
  const comments = req.body.comments;
  const author = req.body.author;

    const blogPost = new BlogPost({
        title:title,
        content: content,
        imageUrl: imageUrl,
        comments:comments,
        author: author
    })
    blogPost.save().then(console.log("it worked")).catch(console.log('ERR')
    );
  res.status(201).json({
    message: "Blogpost craeted succesfully!",
    post: { id: new Date().toISOString(), title: title, content: content },
  });
};

export const updateBlogPost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const deleteBlogPostById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
