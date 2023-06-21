import { Schema, model, Document } from 'mongoose';

interface Comment extends Document {
  content: string;
  author: string;
  blogPost: string;
}

const commentSchema = new Schema<Comment>({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  blogPost: { type: Schema.Types.ObjectId, ref: 'BlogPost', required: true },
});

export default model<Comment>('Comment', commentSchema);
