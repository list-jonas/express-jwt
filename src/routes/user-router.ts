import express, { Router, Request, Response } from "express";
import { usersMock } from "../mock/users-mock";
import { authenticateToken } from "../middleware/authenticate-token";

const userRouter: Router = express.Router();

userRouter.post('/all', authenticateToken, (req: Request, res: Response) => {
    console.log(res.locals.user);
    res.json(usersMock);
});


export default userRouter;