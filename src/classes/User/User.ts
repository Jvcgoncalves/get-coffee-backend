import { Types } from "mongoose";
export default class User {
  email: string;
  password: string;
  username: string;
  cart: Types.ObjectId[] = [];
  orders: Types.ObjectId[] = [];

  constructor ({ email, password, username }: { email: string, password: string, username: string }) {
    this.email = email;
    this.password = password;
    this.username = username;
  }
}