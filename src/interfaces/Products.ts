import mongoose, { Document } from "mongoose";

export default interface IProduct extends Document {
  _id: string;
  description: string;
  imageUrl: string;
  value: number;
  discount: number;
  reviews: mongoose.Types.ObjectId[];
}