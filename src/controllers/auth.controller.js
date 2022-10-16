import { findUserByEmail, createUser, findUserByUsername } from "../models/UserModel.js";
import { createTokens, refreshTokenService } from "../services/jwt.service.js";
import { validateMail, validatePassword, validateUsername } from "../helpers/validators.js";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

export const register = async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ message: "Missing username, password or email" });
    }

    if (validateUsername(username) === false) return res.status(400).json({ message: "Username needs to be between 4-32 characters, have no special characters" });
    if (validatePassword(password) === false) return res.status(400).json({ message: "Password needs to be between 8-32 characters, have one lower and uppercase and one special character" });
    if (validateMail(email) === false)        return res.status(400).json({ message: "Email is not valid" });
    const userEmailCheck    = await findUserByEmail(email)
    const userUsernameCheck = await findUserByUsername(username)
    if (userEmailCheck || userUsernameCheck) return res.status(400).json({ message: "User already exists" });

    createUser({ username, password, email }, (err) => {
        if (err) return res.status(500).json({ message: "Internal server error" });
        return res.status(201).json({ message: "User created" });
    });
};

export const login = async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    if (!password || (!username && !email)) return res.status(400).json({ message: "Missing username or password" });

    let user;
    if (username) user = await findUserByUsername(username);
    else user = await findUserByEmail(email);

    if (!user) return res.status(400).json({ message: "User not found" });

    const result = bcrypt.compare(password, user.password);
    if (!result) return res.status(406).json({ message: "Invalid password" });

    if (user) {
        const tokens = createTokens(user);
        return res.status(200).json({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
    }
}

export const checkAuth = async (req, res) => {
    return res.status(200).json({ username: req.username, email: req.email, grant: req.grant });
}

export const refreshToken = async (req, res) => {
    const tokens = await refreshTokenService(req.headers['x-access-token'], req.headers['x-refresh-token'], res)
    if (Object.keys(tokens).includes("message")) return res.status(400).json(tokens);
    return res.status(200).json(tokens);
}