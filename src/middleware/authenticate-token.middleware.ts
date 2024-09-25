import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth-service';

function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    if (header) {
        const token = header.split(' ')[1];

        AuthService.verifyAccessToken(token, (err, data) => {
            if (err) {
                return res.status(403);
            }

            res.locals.user = data;

            next();
        });

    } else {
        return res.status(401);
    }
}


export { authenticateToken };