import mongoose, { Document } from "mongoose";

export default interface IReviews extends Document {
  _id: string;
  description: string;
  ratingLevel: number;
  likes: number;
  dislikes: number;
  creator: mongoose.Types.ObjectId;
}