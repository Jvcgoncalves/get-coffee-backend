import express, { Request, Response } from "express";
import UserControler from "../../controllers/users_controller/UsersController";
import { userResponses } from "../../responses/UserResponses/UserResponses";

const usersRouter = express.Router();

usersRouter.post("/new", async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  try {
    const response = await UserControler.createNewUser({ email, password, username });

    if (!response.user) {
      res.status(500).json(response); 
      return; 
    }
    
    res.status(200).json(response.user._id);
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
})

usersRouter.post("/login", async (req: Request,res: Response) => {
  const { email, password } = req.body
  
  try {
    if (!email || !password) {
      res.status(401).json(userResponses.MISS_INFOMATION);
      return;
    }

    const response = await UserControler.validateLogin({email, password})
    
    if (!response.user) {
      res.status(500).json(response); 
      return; 
    }

    res.status(200).json(response.user._id)
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
})

export default usersRouter;