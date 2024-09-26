import express, { Router, Request, Response } from "express";
import { TokenRequest } from "../types/token-request";
import { JwtPayload } from "../types/jwt-payload";
import { AuthService } from "../services/auth-service";

const authRouter: Router = express.Router();

authRouter.post('/login', (req: Request, res: Response) => {
    console.log('Request body:', req.body); // Log the incoming request body
    const body = req.body;

    const credentials = body as Credential;

    if (credentials) {
        console.log('Valid credentials object');
        const validUser = AuthService.login(body);

        if (validUser) {
            const jwtPayload: JwtPayload = { username: body.username };
            
            const accessToken = AuthService.generateAccessToken(jwtPayload);
            const refreshToken = AuthService.generateRefreshToken(jwtPayload);
            
            AuthService.addRefreshToken(refreshToken);

            return res.json({ accessToken: accessToken, refreshToken: refreshToken });
        }

        return res.status(403).send('Forbidden');
    } else {
        console.log('Invalid request body');
        return res.status(400).json({ err: 'Invalid Body!' });
    }
});

authRouter.post('/token', (req: Request, res: Response) => {
    const body = req.body;
    console.log('Received token request body:', body);  // Debug log

    const tokenRequest = body as TokenRequest;

    if (tokenRequest) {
        const { token } = body;
        console.log('Token received for verification:', token);  // Debug log

        AuthService.verifyRefreshToken(token, (err, data) => {
            if (err) {
                console.log('Error verifying refresh token:', err);  // Debug log
                return res.status(403).json({ err: err });
            }

            console.log('Verified refresh token successfully, payload:', data);  // Debug log
            const jwtPayload: JwtPayload = data as JwtPayload;
            const accessToken = AuthService.generateAccessToken(jwtPayload);

            console.log('Generated new access token:', accessToken);  // Debug log
            return res.json({ accessToken: accessToken });
        });
    } else {
        console.log('Invalid token request body received.');  // Debug log
        return res.status(401).json({ err: 'Invalid Body!' });
    }
});

authRouter.delete('/logout', (req: Request, res: Response) => {
    const body = req.body;
    console.log('Received logout request body:', body);  // Debug log

    const tokenRequest = body as TokenRequest;

    if (tokenRequest) {
        const { token } = body;
        console.log('Token received for removal:', token);  // Debug log

        AuthService.removeRefreshToken(token);

        console.log('Refresh token removed successfully:', token);  // Debug log
        return res.json({ msg: 'Removed Refresh Token!' });
    } else {
        console.log('Invalid logout request body received.');  // Debug log
        return res.status(401).json({ err: 'Invalid Body!' });
    }
});

export default authRouter;
