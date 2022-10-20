import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

/**
 *  Function to connect to the mongodb, 
 *  for now it only supports logging in with username and password
 */ 
const connectToDB = () => {
    mongoose.connect("mongodb://"+process.env.MONGO_HOST, { 
        dbName: process.env.MONGO_DB,
        authSource: process.env.MONGO_AUTH_DB,
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASSWORD,
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    });
}
export default connectToDB;