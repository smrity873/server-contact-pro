const db = require('../config/db');

const User = {
    create: (userData, callback) => {
        const { username, email, full_name, password, profile_picture_url } = userData;

        const sql = `INSERT INTO users (username, email, full_name, password, profile_picture_url) 
                     VALUES (?, ?, ?, ?, ?)`;

        db.query(sql, [username, email, full_name, password, profile_picture_url], callback);
    },

    // Refactor this function to return a promise
    findByEmail: (email) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM users WHERE email = ?`;
            db.query(sql, [email], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results); // return the results (array) or an empty array if no user is found
            });
        });
    },

    updateProfile: (userId, updatedData, callback) => {
        const { full_name, profile_picture_url } = updatedData;
        const sql = `UPDATE users SET full_name = ?, profile_picture_url = ? WHERE id = ?`;
        db.query(sql, [full_name, profile_picture_url, userId], callback);
    },
};

module.exports = User;