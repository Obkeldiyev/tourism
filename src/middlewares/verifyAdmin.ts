import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface TokenPayload {
    id: string;
    username: string;
    role: string;
}

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.token as string;

    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    }

    try {
        const decoded = verify(token, process.env.SECRET_KEY as string) as TokenPayload;
        (req as any).admin = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};