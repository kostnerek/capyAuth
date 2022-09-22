import sqlite3 from 'sqlite3';
const database = new sqlite3.Database("./perihelium.db");

export const createUsersTable = () => {
    const sqlQuery = `
            CREATE TABLE IF NOT EXISTS users (
            id integer PRIMARY KEY,
            username text,
            password text)
            `;
    return database.run(sqlQuery, (err) => {
        if (err) {
            console.log(err);
        }
        console.log("Users table created");
    });
}

export const findUserByEmail = (username, cb) => {
    return database.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
        cb(err, row)
    });
}

export const findUserById = (id, cb) => {
    return database.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
        cb(err, row)
    });
}


export const createUser = (user, cb) => {
    return database.run('INSERT INTO users (username, password) VALUES (?,?)', user, (err) => {
        cb(err)
    });
}
