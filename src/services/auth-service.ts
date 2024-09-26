
import { credentialsMock } from "../mock/credentials-mock";
import * as jwt from 'jsonwebtoken'
import { JwtPayload } from "../types/jwt-payload";
import { Credentials } from "../types/credentials";

class AuthService {
    private static REFRESH_TOKENS: string[] = [];


    public static login(userCredentials: Credentials): boolean {
        const account = credentialsMock.find(cred => cred.username === userCredentials.username);
    
        if (account) {
            return account.password === userCredentials.password;
        }
    
        return false;
    }

    public static generateAccessToken(payload: JwtPayload): string {
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15s' });
    }

    public static generateRefreshToken(payload: JwtPayload): string {
        return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string)
    }

    public static addRefreshToken(token: string): void {
        AuthService.REFRESH_TOKENS.push(token);
    }

    private static verifyToken(
        token: string,
        secret: string,
        callback: (err: jwt.VerifyErrors|null, data: jwt.JwtPayload|string|undefined) => void
    ) {
        jwt.verify(token, secret, (err, data) => callback(err, data));
    }

    public static verifyAccessToken(
        token: string,
        callback: (err: jwt.VerifyErrors|null, data: jwt.JwtPayload|string|undefined) => void
    ) {
        AuthService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string, callback);
    }

    public static verifyRefreshToken(
        token: string,
        callback: (err: jwt.VerifyErrors|null, data: jwt.JwtPayload|string|undefined) => void
    ) {
        if (AuthService.REFRESH_TOKENS.includes(token)) {
            AuthService.verifyToken(token, process.env.REFRESH_TOKEN_SECRET as string, callback);
        }
    }

    public static removeRefreshToken(token: string): void {
        AuthService.REFRESH_TOKENS = AuthService.REFRESH_TOKENS.filter(t => t !== token);
    }

}

export { AuthService };