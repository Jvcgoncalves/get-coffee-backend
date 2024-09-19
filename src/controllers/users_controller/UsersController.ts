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
  
      const userRegistered = await UserModel.create({ ...newUser });

      return { ...userResponses.USER_REGISTED, user: userRegistered }
    } catch (err) {
      return { code: 500, message: err.message }
    }
  }

  static async validateLogin({ email, password }: { email: string, password: string }): Promise<{ code: number, message: string, user?: any}> {
    try {
      const user = await UserModel.findOne({ email });

      if(!user) {
        return userResponses.USER_NOT_FOUND;
      };
  
      const validPassoword = await validateUserPassword({ password, userPassword: user.password })
  
      if(!validPassoword) {
        return userResponses.INVALID_PASSWORD;
      }
  
      return { ...userResponses.LOGIN_SUCCESSFULL, user: user._id }
    } catch (error) {
      return { code: 500, message: error.message }
    }
  }
}