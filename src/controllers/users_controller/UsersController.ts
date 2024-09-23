import { userResponses } from "../../responses/UserResponses/UserResponses";
import UserModel from "../../models/users_model/users";
import User from "../../classes/User/User";
import validateUserPassword from "../../scripts/validatePassword";

export default class UserControler {
  static async createNewUser({ email, username, password }: { email: string, username: string, password: string }): Promise<{ code: number, message: string, user?: any}>{
    console.log(await UserModel.findOne({ email }))
    try {
      if (await UserModel.findOne({ email })) {
        return userResponses.EMAIL_ALREADY_REGISTED;
      }
  
      const newUser = new User({email, password, username});
  
      const userRegistered = await UserModel.create({ ...newUser }, { runValidators: true });

      return { ...userResponses.USER_REGISTED, user: userRegistered }
    } catch (err) {
      return { code: 500, message: err.message }
    }
  }

  static async validateLogin({ email, password }: { email: string, password: string }): Promise<{ code: number, message: string, userId?: any}> {
    try {
      const user = await UserModel.findOne({ email });

      if(!user) {
        return userResponses.USER_NOT_FOUND;
      };
  
      const validPassoword = await validateUserPassword({ password, userPassword: user.password })
  
      if(!validPassoword) {
        return userResponses.INVALID_PASSWORD;
      }
  
      return { ...userResponses.LOGIN_SUCCESSFULL, userId: user._id }
    } catch (error) {
      return { code: 500, message: error.message }
    }
  }

  static async getUserData({ userId }: { userId: string }): Promise<{ code: number, message: string, user?: any}> {
    if (!userId) {
      return userResponses.USER_ID_REQUIRED;
    }

    try {
      const user = await UserModel.findById(userId).select("username email cart orders");
      
      if (!user) {
        return userResponses.USER_NOT_FOUND;
      }
      
      return { ...userResponses.USER_DATA_FOUND, user }
    } catch (error) {
      return { code: 500, message: error.message }
    }
  }

  static async updateUser({ userId, data }: { userId: string, data: any }): Promise<{ code: number, message: string}> {
    if (!userId) {
      return userResponses.USER_ID_REQUIRED;
    }

    try {
      const responseFromMongo = await UserModel.findOneAndUpdate({ _id: userId }, { $set: data }, { new: true, runValidators: true, select: 'username email password' })

      if (!responseFromMongo) {
        return userResponses.USER_NOT_FOUND;
      }
      
      return { ...userResponses.USER_UPDATED }
    } catch (error) {
      return { code: 500, message: error.message }
    }
  }

  static async deleteUser({ userId, password }): Promise<{ code: number, message: string}> {
    if (!userId) {
      return userResponses.USER_ID_REQUIRED;
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return userResponses.USER_NOT_FOUND;
    }
    
    const validPassoword = await validateUserPassword({ password, userPassword: user.password })

    if (!validPassoword) {
      return userResponses.INVALID_PASSWORD;
    }

    const mongoResponse = UserModel.findByIdAndDelete(userId)
  }
}