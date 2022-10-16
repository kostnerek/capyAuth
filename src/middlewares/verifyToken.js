import dotenv from 'dotenv';
import { validateToken } from '../services/jwt.service.js';
dotenv.config();

export const verifyToken = (req, res, next) => {
    const access_token = req.headers['x-access-token'];
    const refresh_token = req.headers['x-refresh-token'];
    
    if (!access_token && !refresh_token) return res.status(403).send({ message: 'No token provided!' });
    if (access_token && refresh_token) return res.status(403).send({ message: 'Both tokens provided!' });
    
    let validatedToken;

    if (access_token)  validatedToken = validateToken("access", access_token);
    if (refresh_token) validatedToken = validateToken("refresh", refresh_token);
    
    if (validatedToken) {
        req.username = validatedToken.username;
        req.email = validatedToken.email;
        req.grant = validatedToken.grant;
        next();
    } else {
        return res.status(401).send({ message: 'Unauthorized!' });
    }
}