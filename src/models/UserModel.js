import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
    created_at: { type: Date, default: Date.now },
});

/**
 * Pre-save hook which hashes the password before saving it to the database, 
 * if the password is modified or user is new
 */
UserSchema.pre('save', async function (next) {
    const user = this;
    if(user.isModified('password') || user.isNew) {
        // await here is needed despite of bcrypt.hash not being as async function, don't know why
        user.password = await bcrypt.hash(user.password, 10)
    }
    next();
})

// Geenrate model from schema
const UserModel = mongoose.model("users", UserSchema);

/**
 * Function which search for user in the database based on the provided email
 * @param {String} email - Email to search for
 * @returns {Object|null} - User object [username, password, email, created_at]
 */
export const findUserByEmail = async (email) => {
    return UserModel.findOne({ email: email })
    .then((user) => {
        return user;
    })
};
/**
 * Function which search for user in the database based on the provided username
 * @param {String} username - Email to search for
 * @returns {Object|null} - User object [username, password, email, created_at]
 */
export const findUserByUsername = async (username) => {
    return UserModel.findOne({ username: username })
    .then((user) => {
        return user;
    })
};

/**
 * Function which creates new user in the database
 * @param {Object} user - User object consisting of username, password and email [username, password, email]
 * @param {Callback} callback - Callback function to execute after the user is created
 */
export const createUser = (user, cb) => {
    const user_instance = new UserModel({ username: user.username, password: user.password, email: user.email });
    user_instance.save((err) => {
        cb(err);
    });
};