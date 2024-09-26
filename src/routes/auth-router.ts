import express, { Router, Request, Response } from "express";
import { isTokenRequest } from "../types/token-request";
import { JwtPayload } from "../types/jwt-payload";
import { isCredentialsObject } from "../types/credentials";
import { AuthService } from "../services/auth-service";

const authRouter: Router = express.Router();


authRouter.post('/login', (req: Request, res: Response) => {
    const body = req.body;

    if (isCredentialsObject(body)) {
        const validUser = AuthService.login(body);

        if (validUser) {
            const jwtPayload: JwtPayload = {
                username: body.username
            };
            
            const accessToken = AuthService.generateAccessToken(jwtPayload);
            const refreshToken = AuthService.generateRefreshToken(jwtPayload);
            
            AuthService.addRefreshToken(refreshToken);

            return res.json({ accessToken: accessToken, refreshToken: refreshToken });
        }

        return res.status(403);
    } else {
        return res.status(400).json({
            err: 'Invalid Body!'
        });
    }
});

authRouter.post('/token', (req: Request, res: Response) => {
    const body = req.body;

    if (isTokenRequest(body)) {
        const { token } = body;

        AuthService.verifyRefreshToken(token, (err, data) => {
            if (err) {
                res.status(403).json({
                    err: err
                });
            }

            const jwtPayload: JwtPayload = data as JwtPayload;
            const accessToken = AuthService.generateAccessToken(jwtPayload);

            return res.json({
                accessToken: accessToken
            });
        });
    } else {
        return res.status(401).json({
            err: 'Invalid Body!'
        });
    }
});

authRouter.delete('/logout', (req: Request, res: Response) => {
    const body = req.body;

    if (isTokenRequest(body)) {
        AuthService.removeRefreshToken(body.token);

        return res.json({
            msg: 'Removed Refresh Token!'
        })
    } else {
        return res.status(401).json({
            err: 'Invalid Body!'
        });
    }
});

export default authRouter;