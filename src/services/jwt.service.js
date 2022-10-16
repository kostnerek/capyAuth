import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION;
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION;

export const createTokens = (user) => {
    const accessToken = jwt.sign({ username: user.username, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
    const refreshToken = jwt.sign({ username: user.username, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
    return { accessToken, refreshToken };
}

export const validateToken = (type, token) => {
    if (type==="access") {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) return false;
            return { username: decoded.username, email: decoded.email, grant: 0 };
        });
    }
    else if (type==="refresh") {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return false;
            return { username: decoded.username, email: decoded.email, grant: 1 };
        });
    }
    return false;
}

export const refreshTokenService = async (accessToken, refreshToken) => {
    if (!refreshToken && !accessToken) return  { message: "Missing token" };
    if (refreshToken && accessToken) return { message: "Both tokens are present" };
    if (refreshToken && !accessToken) {
        const user = validateToken("refresh", refreshToken);
        if(user) {
            return {refreshToken: createTokens(user).refreshToken};
        }
    }
    if (accessToken && !refreshToken) {
        const user = validateToken("access", accessToken);
        if(user) {
            const tokens = createTokens(user);
            return {accessToken: tokens.accessToken, refreshToken: tokens.refreshToken};
        }
    }
    return { message: "Invalid token" };
}