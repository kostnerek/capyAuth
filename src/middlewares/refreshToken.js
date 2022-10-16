import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { validateToken, createTokens } from '../services/jwt.service.js';
dotenv.config();



export const refreshToken = (req, res, next) => {
    return res.status(200).send({ message: 'Refresh token' });
}