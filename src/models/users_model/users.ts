import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto"
import IUser from "../../interfaces/User";

const UserSchema: Schema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: false },
  cart:  [{
    type: String
  }],
  orders: [{
    type: String
  }]
})

UserSchema.pre('save', async function(next) {
  this.salt = crypto.randomBytes(24).toString("hex");
  this.password = await bcrypt.hash(this.password as string, 8);

  next();
});

UserSchema.pre('findOneAndUpdate', async function(next) {
  let update = this.getUpdate();
  const { password } = (update as any).$set;
  
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 8);
    this.setUpdate({ ...update, password: hashedPassword });
  }
  
  next();
});

const UserModel = mongoose.model<IUser>("users", UserSchema);
export default UserModel;