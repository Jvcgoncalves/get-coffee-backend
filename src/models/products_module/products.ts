import mongoose, { Schema } from "mongoose";
import IProduct from "../../interfaces/Products";

const productSchema: Schema = new Schema<IProduct>({
  description: { type: String },
  imageUrl: { type: String },
  value: { type: Number },
  discount: { type: Number },
  reviews: [{
    type: String
  }]
})

const ProductsModel = mongoose.model<IProduct>("products", productSchema);
export default ProductsModel;