import mongoose, { Schema, model, Document, Types } from 'mongoose';


interface BlogPost extends Document {
  title: string;
  imageUrl: string;
  content: string;
  author:  Types.ObjectId;
  comments: string[];
}

const blogPostSchema = new Schema<BlogPost>({
  title: { type: String, required: true },
  imageUrl: {type: String},
  content: { type: String, required: true },
  author: { type:  Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
}, {timestamps: true});

const BlogPostModel = mongoose.model("BlogPost", blogPostSchema);
export { BlogPostModel };
