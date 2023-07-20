import mongoose, { Schema, model, Document } from 'mongoose';

interface User extends Document {
  name: string;
  email: string;
  password: string;
  secretCode: number;
}

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  secretCode: {type: Number, required: true}
});

const UserModel = mongoose.model("User", userSchema);
export { UserModel };

