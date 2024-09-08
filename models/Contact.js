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
