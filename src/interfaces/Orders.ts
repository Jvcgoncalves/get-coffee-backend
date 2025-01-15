import mongoose, { Document } from "mongoose";

export default interface IOrder extends Document {
  _id: string
  value: number;
  products: mongoose.Types.ObjectId[];
  client: mongoose.Types.ObjectId;
  /** 
  * 1 -> creating | 2 -> completed | 3 -> canceled
  */
  status: 1 | 2 | 3;
}