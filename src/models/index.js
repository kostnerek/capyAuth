import { Sequelize } from "sequelize";
import dbConfig from "../db.config.js";
import UserModel from "./UserModel.postgres.js";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: 'postgres',
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = UserModel(sequelize, Sequelize);

export default db;
