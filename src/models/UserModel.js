import mongoose from "mongoose";

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
});

const UserModel = mongoose.model("periAuth", UserSchema);

export const findUserByEmail = (email, cb) => {
    UserModel.findOne({ email: email }, (err, user) => {
        cb(err, user);
    });
};

export const findUserByUsername = (username, cb) => {
    UserModel.findOne({ username: username }, (err, user) => {
        cb(err, user);
    });
};

export const createUser = (user, cb) => {
    const user_instance = new UserModel({ username: user.username, password: user.password, email: user.email });
    user_instance.save((err) => {
        cb(err);
    });
};