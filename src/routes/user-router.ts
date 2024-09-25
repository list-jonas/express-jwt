import express, { Router, Request, Response } from "express";
import { fakeUsers } from "../data/users-mock";
import { authenticateToken } from "../middleware/authenticate-token.middleware";

const userRouter: Router = express.Router();

userRouter.get('/all', authenticateToken, (req: Request, res: Response) => {
    console.log(res.locals.user);
    res.json(fakeUsers);
});


export default userRouter;