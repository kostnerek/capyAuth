import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import morgan from 'morgan';
import * as db from './db.js';
import { verifyToken } from './middlewares/verifyToken.js';


dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION;
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION;


app.use(express.json());
app.use(morgan('tiny'));

app.post('/auth/register', (req, res) => {
    const { username, password } = req.body;
    db.findUserByEmail(username, (err, user) => {
        if (err) return res.status(500).send('Server error!');
        if (user) return res.status(400).send({message: 'User already exists'});
        db.createUser([username, password], (err) => {
            if (err) return res.status(500).send('Server error!');
            res.status(201).send({message: 'User created successfully'});
        });
    });
})

app.get('/auth/login', (req, res) => {
    const { username, password } = req.body;
    db.findUserByEmail(username, (err, user) => {
        if (err) return res.status(500).send('Server error!');
        if (user?.username === username && user?.password === password) {
            const accessToken = jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET, {
                expiresIn: ACCESS_TOKEN_EXPIRATION
            });
            const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, {
                expiresIn: REFRESH_TOKEN_EXPIRATION
            });
            res.status(200).send({
                "user": user, "access_token": accessToken, "refresh_token": refreshToken, "expires_in": ACCESS_TOKEN_EXPIRATION
            });
        } else {
            res.status(401).send({ message: 'Invalid credentials' });
        }
    })
})

app.get('/auth', verifyToken, (req, res) => {
    console.log("UID: ", req.userId);
    db.findUserById(req.userId, (err, user) => {
        if (err) return res.status(500).send('Server error!');
        user['grant'] = req.grant;
        delete user.password;
        res.status(200).send({'user': user});
    });
})

// TODO - Implement refreshing tokens
/* app.get('/auth/refresh', refreshToken, (req, res) => {

}) */

app.listen(port, () => {
    db.createUsersTable();
    console.log(`Server started on port ${port}`);
});
