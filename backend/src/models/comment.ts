import mongoose, { Schema, model, Document, Types } from 'mongoose';

interface Comment extends Document {
  content: string;
  author: Types.ObjectId;
  blogPost: Types.ObjectId;
}

const commentSchema = new Schema<Comment>({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  blogPost: { type: Schema.Types.ObjectId, ref: 'BlogPost'},
}, {timestamps: true});

const CommentModel = mongoose.model("Comment", commentSchema);
export { CommentModel };
