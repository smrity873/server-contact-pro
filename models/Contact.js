const db = require('../config/db');

const Contact = {
    create: (contactData, userId, callback) => {
        const { name, phone, email, address, profile_picture_url } = contactData;
        const sql = `INSERT INTO contacts (name, phone, email, address, profile_picture_url, user_id)
                 VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(sql, [name, phone, email, address, profile_picture_url, userId], callback);
    },

    getAll: (userId, callback) => {
        const sql = `SELECT * FROM contacts WHERE user_id = ?`;
        db.query(sql, [userId], callback);
    },

    getOne: (userId, contactId, callback) => {
        const query = 'SELECT * FROM contacts WHERE user_id = ? AND id = ? LIMIT 1';
        db.query(query, [userId, contactId], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results[0]); // Assuming there's only one result
        });
    },

    update: (contactId, updatedData, callback) => {
        const { name, phone, email, address, profile_picture_url } = updatedData;
        const sql = `UPDATE contacts SET name = ?, phone = ?, email = ?, address = ?, profile_picture_url = ?
                 WHERE id = ?`;
        db.query(sql, [name, phone, email, address, profile_picture_url, contactId], callback);
    },

    delete: (contactId, callback) => {
        const sql = `DELETE FROM contacts WHERE id = ?`;
        db.query(sql, [contactId], callback);
    },
};

module.exports = Contact;
