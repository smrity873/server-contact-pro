const db = require('../config/db');

const User = {
    create: (userData, callback) => {
        const { username, email, full_name, password, profile_picture_url } = userData;

        const sql = `INSERT INTO users (username, email, full_name, password, profile_picture_url) 
                 VALUES (?, ?, ?, ?, ?)`;

        db.query(sql, [username, email, full_name, password, profile_picture_url], callback);
    },

    findByEmail: (email, callback) => {
        const sql = `SELECT * FROM users WHERE email = ?`;
        db.query(sql, [email], callback);
    },

    updateProfile: (userId, updatedData, callback) => {
        const { full_name, profile_picture_url } = updatedData;
        const sql = `UPDATE users SET full_name = ?, profile_picture_url = ? WHERE id = ?`;
        db.query(sql, [full_name, profile_picture_url, userId], callback);
    },
};

module.exports = User;