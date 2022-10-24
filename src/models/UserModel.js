import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const UserModel = (sequelize, { DataTypes }) => {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            }
            
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            }
        },
        mail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            }
        },
    });

    User.findUserByUsername = async (username) => {
        return User.findOne({ where: { username: username } })
    };

    User.findUserByEmail = async (mail) => {
        return User.findOne({ where: { mail: mail } })
    };

    User.createUser = async (user) => {
        const id = uuidv4();
        const password = await bcrypt.hash(user.password, 10)
        return User.create({ id: id, username: user.username, password: password, mail: user.email })
    };

    return User;
}
export default UserModel;