import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator/src/validation-result";
import { CommentModel } from "../models/comment";
import { BlogPostModel } from "../models/blogPost";
import { StatusError } from "../helper/statusError";

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new StatusError("Adding comment has failed!");
    error.status = 422;
    error.data = errors.array();
    throw error;
  }
  console.log(req.body);
  const content = req.body.content;
  const author = req.body.author;
  const blogPost = req.body.blogPost;

  const comment = new CommentModel({
    content: content,
    author: author,
    blogPost: blogPost,
  });
  comment.save();
  console.log(req.body.blogPost);
  const post = await BlogPostModel.findById(blogPost);
  if (!post) {
    const error = new StatusError("Could not find blog post.");
    error.status = 404;
    throw error;
  }
  post.comments.push(comment._id);
  post.save();
  res.status(201).json({
    message: "Comment added succesfully!",
    createdCommentId: comment._id,
  });
};

export const getCommentsByPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = req.params.postId;

  const comments = await CommentModel.find({ blogPost: postId });

  if (!comments) {
    const error = new StatusError("Could not find any comments.");
    error.status = 404;
    throw error;
  }
  res.status(200).json({
    message: "Comments for the blogpost ",
    comments: comments,
  });
};

export const getCommentsByAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorId = req.params.authorId;

  const comments = await CommentModel.find({ author: authorId });

  if (!comments) {
    const error = new StatusError("Could not find any comments.");
    error.status = 404;
    throw error;
  }

  res.status(200).json({
    message: "Comments for the blogpost ",
    comments: comments,
  });
};

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId = req.params.commentId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new StatusError("Updating post failed!");
    error.status = 422;
    throw error;
  }
  const newContent = req.body.content;

  const comment = await CommentModel.findById(commentId);

  if(!comment) {
    const error = new StatusError('Could not find comment.');
    error.status = 404;
    throw error;
  }
  comment.content = newContent;
  comment.save();

  res.status(200).json({
    message: "Comments has been updated",
    comment: comment,
  });

};

export const deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const commentId = req.params.commentId;

    const comment = await CommentModel.findById(commentId);

    if(!comment) {
        const error = new StatusError('Could not find comment.');
        error.status = 404;
        throw error;
      }

    const post = await BlogPostModel.findById(comment.blogPost);
    if (!post) {
        const error = new StatusError("Could not find blog post.");
        error.status = 404;
        throw error;
      }
    let comments = post.comments;

    const index = comments.indexOf(commentId);

    if (index > -1) { 
        comments.splice(index, 1); 
      }

    post.comments  = comments;
    post.save();
    await CommentModel.findByIdAndRemove(commentId);
    res.status(200).json({
        message: "Comment has been deleted",
        comment: comment,
      });
}