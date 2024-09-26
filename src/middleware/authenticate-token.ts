import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth-service';

function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const body = req.body;

    console.log('Received token request body:', body);  // Debug log
    

    if (body.token) {
        const { token } = body;

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