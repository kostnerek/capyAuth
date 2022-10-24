import { createTokens, refreshTokenService } from "../services/jwt.service.js";
import { validateMail, validatePassword, validateUsername } from "../helpers/validators.js";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import db from '../models/index.js';
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

/**
 * Function which handles user registration
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
export const register = async (req, res) => {
    const { username, password, email } = req.body;
    // if any of the fields are empty, return error
    if (!username || !password || !email) {
        return res.status(400).json({ message: "Missing username, password or email" });
    }
    // console.log("Registering new user");
    // validate username, password and email if any of them is invalid, return error
    if (validateUsername(username) === false) return res.status(400).json({ message: "Username needs to be between 4-32 characters, have no special characters" });
    if (validatePassword(password) === false) return res.status(400).json({ message: "Password needs to be between 8-32 characters, have one lower and uppercase and one special character" });
    if (validateMail(email) === false)        return res.status(400).json({ message: "Email is not valid" });

    // check if user with the same username or email already exists, if so return error
    // db.Users.findUserByEmail
    const userEmailCheck    = await db.Users.findUserByEmail(email)
    const userUsernameCheck = await db.Users.findUserByUsername(username)
    
    if (userEmailCheck || userUsernameCheck) return res.status(400).json({ message: "User already exists" });

    // save user to the database
    const user = await db.Users.createUser({ username, password, email })
    if (!user) return res.status(500).json({ message: "Internal server error" });
    return res.status(201).json({ message: "User created" });
};

/**
 *  Function which handles user login
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
export const login = async (req, res) => {
    const { username, password, email } = req.body;
    if (!password || (!username && !email)) return res.status(400).json({ message: "Missing username or password" });

    let user;
    // if username is provided, find user by username else find user by email
    if (username) user = await db.Users.findUserByUsername(username);
    else user = await db.Users.findUserByEmail(email);

    // if user is not found, return error
    if (!user) return res.status(400).json({ message: "User not found" });

    // compare password hash with the one in the database if they don't match, return error
    const result = await bcrypt.compare(password, user.password);
    if (!result) return res.status(406).json({ message: "Invalid password" });

    // if everything is ok, create tokens and return them
    if (user) {
        const tokens = createTokens(user);
        return res.status(200).json({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
    }
}

/**
 * Function which other APIs use to check if provided access/refresh tokens are valid
 * To use it your API needs to have a header with the token
 * X-Access-Token for access token
 * X-Refresh-Token for refresh token
 * Can't be used for both tokens at the same time
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @returns {Object} - returns user object with grant level if tokens are valid, otherwise returns error
 */
export const checkAuth = async (req, res) => {
    return res.status(200).json({ username: req.username, email: req.email, grant: req.grant });
}

/**
 * Function which refreshes tokens, can be used both for access and refresh tokens
 * @example if you have an access token and you want to refresh it, 
 * you need to send a request with the access token in the header X-Access-Token, 
 * this will return you a new access token and a new refresh token
 * @example if you have a refresh token and you want to refresh it, 
 * you need to send a request with the refresh token in the header X-Refresh-Token, 
 * this will return you a new refresh token
 * 
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @returns {Object} - returns new refresh (and access) token 
 */
export const refreshToken = async (req, res) => {
    const tokens = await refreshTokenService(req.headers['x-access-token'], req.headers['x-refresh-token'], res)
    if (Object.keys(tokens).includes("message")) return res.status(400).json(tokens);
    return res.status(200).json(tokens);
}