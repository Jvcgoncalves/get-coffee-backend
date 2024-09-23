import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import IUser from "../../interfaces/User";

const UserSchema: Schema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true }
    }
  ],
  orders: [
    {
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: "orders", required: true }
    }
  ],
})

UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password as string, 8);
  }
  next();
});

UserSchema.pre('findOneAndUpdate', async function(next) {
  let update = this.getUpdate();
  const { password } = (update as any).$set;
  
  if (password ) {
    const hashedPassword = await bcrypt.hash(password, 8);
    this.setUpdate({ ...update, password: hashedPassword });
  }
  
  next();
});

const UserModel = mongoose.model<IUser>("users", UserSchema);
export default UserModel;