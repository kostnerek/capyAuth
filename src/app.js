import express from 'express';
import expressWs from 'express-ws'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import fs from 'fs';
import morgan from 'morgan';
import { verifyToken } from './middlewares/verifyToken.js';
import { websocketLogger } from './middlewares/loggerMiddleware.js';
import { findUserByEmail, createUser, findUserByUsername } from './models/UserModel.js';
import mongoose from "mongoose";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION;
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION;

expressWs(app);
app.use(websocketLogger);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const accessLogStream = fs.createWriteStream('./logs/' + "access.log", {flags: 'a'});
app.use(morgan({stream: accessLogStream}));
app.use(morgan('<:remote-addr> :remote-user |:method :url - :status| :user-agent :response-time ms [:date[iso]]'));

mongoose.connect("mongodb://"+process.env.MONGO_HOST, { 
    dbName: process.env.MONGO_DB,
    authSource: process.env.MONGO_AUTH_DB,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD,
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

app.ws('/echo', (ws, req) => {
    console.log(req.msg)
    ws.on('message', (msg) => {
        let current_logs = fs.readFileSync('./logs/' + "access.log", {flags: 'a'});
        current_logs = current_logs.toString();
        console.log(current_logs)
        ws.send(current_logs);
        // ws.send(msg);
    });

    console.log('socket', req.testing);
});

app.post('/auth/register', (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ message: "Missing username, password or email" });
    }
    findUserByEmail(email, (err, user) => {
        if (err) return res.status(500).json({ message: "Internal server error" });
        console.log(user, err);
        if (user) return res.status(400).json({ message: "User already exists" });
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ message: "Internal server error" });
            createUser({ username, password: hash, email }, (err) => {
                if (err) return res.status(500).json({ message: "Internal server error" });
                return res.status(201).json({ message: "User created" });
            });
        });
    });
})

app.get('/auth/login', (req, res) => {
    console.log(req.body);
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    if (!password || (!username && !email)) return res.status(400).json({ message: "Missing username or password" });
    
    const checkIfCanBeAuthenticated = (user) => {
        if (!user) return res.status(400).json({ message: "User not found" });
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) return res.status(500).json({message: "Internal server error"});
            if (!result) return res.status(400).json({message: "Invalid password"});
            const accessToken = jwt.sign({ username: user.username, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
            const refreshToken = jwt.sign({ username: user.username, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
            console.log(accessToken, refreshToken);
            return res.status(200).json({ accessToken, refreshToken });
        });
    };

    if(username) {
        findUserByUsername(username, (err, user) => {
            if (err) return res.status(500).json({message: "Internal server error"});
            if (!user) return res.status(400).json({message: "User not found"});
            return checkIfCanBeAuthenticated(user);
        });
    } else {
        findUserByEmail(email, (err, user) => {
            if (err) return res.status(500).json({message: "Internal server error"});
            if (!user) return res.status(400).json({message: "User not found"});
            return checkIfCanBeAuthenticated(user);
        });
    }
})

app.get('/auth', verifyToken, (req, res) => {
    // console.log(req);
    return res.status(200).json({user:{ username: req.username, email: req.email, grant: req.grant }});
})

// TODO - Implement refreshing tokens
/* app.get('/auth/refresh', refreshToken, (req, res) => {

}) */

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
