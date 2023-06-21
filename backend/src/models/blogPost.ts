import mongoose, { Schema, model, Document, Types } from 'mongoose';
import {userSchema} from './user'

interface BlogPost extends Document {
  title: string;
  content: string;
  author: string;
  categories: string[];
  comments: string[];
}

const blogPostSchema = new Schema<BlogPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type:  Schema.Types.ObjectId, ref: 'User', required: true },
  categories: [{ type: String }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

export default model<BlogPost>('BlogPost', blogPostSchema);
