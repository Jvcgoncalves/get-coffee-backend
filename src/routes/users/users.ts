import express, { Request, Response } from "express";
import UserControler from "../../controllers/users_controller/UsersController";
import { userResponses } from "../../responses/UserResponses/UserResponses";
import jwt from 'jsonwebtoken';
import generateUserSecret from "../../scripts/generateUserSecret";
import { authenticateJwt } from "../../middleware/middleware";

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
  const { email, password } = req.body;
  
  try {
    if (!email || !password) {
      res.status(401).json(userResponses.MISS_INFOMATION);
      return;
    }

    const response = await UserControler.validateLogin({email, password});
    
    if (!response.user?.id) {
      res.status(500).json(response); 
      return; 
    }

    const userToken = generateUserSecret(process.env.BASE_JWT_SECRET, response.user.id, response.user.salt);

    const token = jwt.sign(
      { userId: response.user.id, email },
      userToken,
      { expiresIn: '1h' }
    )

    res.status(200).json({ userId: response.user.id, token });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

usersRouter.get("/:userId", authenticateJwt, async (req: Request, res: Response) => {
  const userId = req.params['userId'];

  try {
    const response = await UserControler.getUserData({ userId });

    if (!response.user) {
      res.status(400).json(response);
      return;
    }

    if (response.code === userResponses.USER_NOT_FOUND.code) {
      res.status(404).json(response);
      return;
    }
    
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

usersRouter.put("/edit/:userId", authenticateJwt, async (req: Request, res: Response) => {
  const userId = req.params['userId'];
  const data = req.body['data']
  try {
    const response = await UserControler.updateUser({ userId, data });
    
    if (response.code === userResponses.USER_ID_REQUIRED.code) {
      res.status(400).json(response);
      return;
    }

    if (response.code === userResponses.USER_NOT_FOUND.code) {
      res.status(404).json(response);
      return;
    }
    
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

usersRouter.delete("/delete/:userId", authenticateJwt, async (req: Request, res: Response) => {
  const userId = req.params['userId'];

  try {
    const response = await UserControler.deleteUser({ userId });
    
    if (response.code === userResponses.USER_ID_REQUIRED.code) {
      res.status(400).json(response);
      return;
    }

    if (response.code === userResponses.USER_NOT_FOUND.code) {
      res.status(404).json(response);
      return;
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

export default usersRouter;