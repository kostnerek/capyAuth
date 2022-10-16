import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
    created_at: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function (next) {
    console.log(this)
    const user = this;
    if(user.isModified('password') || user.isNew) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    next();
})

const UserModel = mongoose.model("users", UserSchema);

export const findUserByEmail = async (email) => {
    return UserModel.findOne({ email: email })
    .then((user) => {
        return user;
    })
};

export const findUserByUsername = async (username) => {
    return UserModel.findOne({ username: username })
    .then((user) => {
        return user;
    })
};

export const createUser = (user, cb) => {
    const user_instance = new UserModel({ username: user.username, password: user.password, email: user.email });
    user_instance.save((err) => {
        cb(err);
    });
};