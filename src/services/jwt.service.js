import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION;
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION;

/** 
 * Function which generates new access and refresh tokens
 * @param {Object} user - User object consisting of username and mail, which will be embedded in the token
 * @returns {Object} - Object consisting of access and refresh token
*/ 
export const createTokens = (user) => {
    const accessToken = jwt.sign({ username: user.username, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
    const refreshToken = jwt.sign({ username: user.username, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
    return { accessToken, refreshToken };
}

/**
 * Function which verifies the access and refresh token
 * @param {String} type - Specifies which token to verify
 * @param {String} token - Token to verify
 * @returns {Object|Boolean} - Object consisting of username, email and grant level based on the token level 
 * or false if token is invalid
*/
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

/**
 * Function which generates new tokens based on the provided token,
 * @example if access token is provided, new access and refresh token will be generated,
 * but if refresh token is provided, only new refresh token will be generated
 * Only one token is required to generate new tokens
 * @param {String} accessToken - Token to generate new tokens from
 * @param {String} refreshToken - Token to generate new tokens from
 * @returns {Object} - Object consisting of refresh (and access token if access token was provided)
 */
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