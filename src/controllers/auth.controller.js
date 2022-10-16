import { findUserByEmail, createUser, findUserByUsername } from "../models/UserModel.js";
import { createTokens } from "../services/jwt.service.js";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

export const register = async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ message: "Missing username, password or email" });
    }
    const userEmailCheck    = await findUserByEmail(email)
    const userUsernameCheck = await findUserByUsername(username)
    if (userEmailCheck || userUsernameCheck) return res.status(400).json({ message: "User already exists" });
    createUser({ username, password, email }, (err) => {
        if (err) return res.status(500).json({ message: "Internal server error" });
        return res.status(201).json({ message: "User created" });
    });
    /* bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: "Internal server error" });
        createUser({ username, password: hash, email }, (err) => {
            if (err) return res.status(500).json({ message: "Internal server error" });
            return res.status(201).json({ message: "User created" });
        });
    }); */
    
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
    if (!result) return res.status(400).json({ message: "Invalid password" });

    if (user) {
        const tokens = createTokens(user);
        return res.status(200).json({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
    }
}

export const checkAuth = async (req, res) => {
    return res.status(200).json({ username: req.username, email: req.email, grant: req.grant });
}

export const refreshToken = async (req, res) => {

}