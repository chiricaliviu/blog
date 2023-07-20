import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator/src/validation-result";
import { BlogPostModel } from "../models/blogPost";
import { CommentModel } from "../models/comment";
import {StatusError} from '../helper/statusError'
import * as fs from 'fs';
import * as path from 'path';
import * as mongoose from "mongoose"

const ObjectId = mongoose.Types.ObjectId;

export const getAllBlogPosts = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  const currentPage: number  = (<number><unknown>req.query.page || 1) 
  const perPage = 10;
  let totalItems: number;
  BlogPostModel.find().countDocuments().then(count => {
    totalItems = count;
    return BlogPostModel.find()
    .skip((currentPage -1) * perPage)
    .limit(perPage);
  }).then(posts => {
    res.status(200).json({message: "Fetched blog posts successfully", posts: posts, totalPosts: totalItems})
  }).catch((err) => {
    if(!err.status) {
      err.status = 500;
    }
    next(err);
  });

  

};

export const getBlogPostById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = req.params.id;
  BlogPostModel.findById(postId).then(post => {
    if(!post) {
      const error = new StatusError('Could not find post.');
      error.status = 404;
      throw error;
    }
    res.status(200).json({ message: 'Post fetched.', post: post });
  }).catch((err) => {
    if(!err.status) {
      err.status = 500;
    }
    next(err);
  });
};

export const createBlogPost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new StatusError("Creating a post failed!");
    error.status  = 422;
    error.data = errors.array();
    throw error;

  }
  if(!req.file) {
    const error = new StatusError("No image provided.");
    error.status = 422;
    throw error;
  }

  const imageUrl = req.file.path.replace("\\" ,"/");
  const title = req.body.title;
  const content = req.body.content;
  const comments = req.body.comments;
  const author = req.userId;

  const blogPost = new BlogPostModel({
    title: title,
    content: content,
    imageUrl: imageUrl,
    comments: comments,
    author: author,
  });
  blogPost
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Blogpost created succesfully!",
        post: result,
      });
    })
    .catch((err) => {
      if(!err.status) {
        err.status = 500;
      }
      next(err);
    });
};

export const updateBlogPost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new StatusError("Updating post failed!");
    error.status  = 422;
    throw error;

  }
  const title = req.body.title;
  const content = req.body.content;
  const comments = req.body.comments;
  const author = req.body.author;
  let imageUrl = req.body.imageUrl;
  if(req.file) {
    imageUrl = req.file.path.replace("\\","/");
  }
  if(!imageUrl) {
    const error = new StatusError("No file picked.");
    error.status  = 422;
    throw error;
  }

  BlogPostModel.findById(postId).then(post => {
    if(!post) {
      const error = new StatusError('Could not find post.');
      error.status = 404;
      throw error;
    }

    if (post.author.toString() !== req.userId) {
      const error = new StatusError('Not authorized.');
      error.status = 403;
      throw error;
    }

    if(imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl)
    }
    post.title = title;
    post.content = content;
    post.comments = comments;
    post.author = author;
    post.imageUrl = imageUrl;
    return post.save();
  })
  .then(result => {
    res.status(200).json({message: 'Post updated!', post: result})
  })
  .catch((err) => {
    if(!err.status) {
      err.status = 500;
    }
    next(err);
  });;
};

const clearImage = (filePath: string)  => {
  filePath = filePath;
  fs.unlink(filePath, err => console.log(err));
};

export const deleteBlogPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("req");
  console.log(req.userId);
  const postId = req.params.id;
  const post = await BlogPostModel.findById(postId)
  if(!post) {
    const error = new StatusError('Could not find post.');
    error.status = 404;
    throw error;
  }
  if (post.author.toString() !== req.userId) {
      const error = new StatusError('Not authorized.');
      error.status = 403;
      throw error;
    }
  if(post.imageUrl) {

    clearImage(post.imageUrl);
  }
  const idsToRemove = post.comments;

  const objectIds = idsToRemove.map(id => new ObjectId(id));

  const result = await CommentModel.deleteMany({ _id: {$in : objectIds}});

  const deletedPost = await BlogPostModel.findByIdAndRemove(postId);

  res.status(200).json({message: "Deleted post!."})
  
  // .catch((err) => {
  //   if(!err.status) {
  //     err.status = 500;
  //   }
  //   next(err);
  // });;
};
