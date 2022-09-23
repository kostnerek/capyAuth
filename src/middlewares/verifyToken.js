import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {
    const access_token = req.headers['x-access-token'];
    const refresh_token = req.headers['x-refresh-token'];
    
    if (!access_token && !refresh_token) return res.status(403).send({ message: 'No token provided!' });
    if (access_token && refresh_token) return res.status(403).send({ message: 'Both tokens provided!' });
    
    if (access_token) {
        jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(401).send({ message: 'Unauthorized!' });
            req.username = decoded.username;
            req.email = decoded.email;
            req.grant = 0;
            next();
        });
    }
    if (refresh_token) {
        jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(401).send({ message: 'Unauthorized!' });
            req.username = decoded.username;
            req.email = decoded.email;
            req.grant = 1;
            next();
        });
    }
}