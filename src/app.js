import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from "mongoose";
import bodyParser from "body-parser";
import authRouter from './routes/auth.route.js';


const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('<:remote-addr> :remote-user |:method :url - :status| :user-agent :response-time ms [:date[iso]]'));

mongoose.connect("mongodb://"+process.env.MONGO_HOST, { 
    dbName: process.env.MONGO_DB,
    authSource: process.env.MONGO_AUTH_DB,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD,
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});


app.use('/auth', authRouter);


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
