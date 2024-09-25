import express, { Express } from "express";
import { config } from 'dotenv'; 
import userRouter from "./routes/user-router";
import authRouter from "./routes/auth-router";

config()

const app: Express = express();

app.use(express.json());

app.use('/users', userRouter);
app.use('/auth', authRouter);

const port = process.env.PORT || 6969;
app.listen(port, () => console.log('Running on port ' + port))