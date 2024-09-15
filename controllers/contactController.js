const Contact = require('../models/Contact');
const db = require('../config/db');

const createContact = (req, res) => {
    const userId = req.user.id;
    const contactData = req.body;

    Contact.create(contactData, userId, (err, result) => {
        if (err) return res.status(500).json({ message: 'Contact creation failed' });
        res.status(201).json({ message: 'Contact created successfully' });
    });
};

const getContacts = (req, res) => {
    const userId = req.user.id;

    Contact.getAll(userId, (err, contacts) => {
        if (err) return res.status(500).json({ message: 'Error fetching contacts' });
        res.json(contacts);
    });
};

const getContact = (req, res) => {
    const userId = req.user.id;
    const contactId = req.params.id; // assuming contactId is passed in the URL as a param

    // Fetch a single contact based on userId and contactId
    Contact.getOne(userId, contactId, (err, contact) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching contact' });
        }
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.json(contact);
    });
};

const updateContact = (req, res) => {
    const contactId = req.params.id;
    const updatedData = req.body;

    Contact.update(contactId, updatedData, (err, result) => {
        if (err) return res.status(500).json({ message: 'Contact update failed' });
        res.json({ message: 'Contact updated successfully' });
    });
};

const deleteContact = (req, res) => {
    const contactId = req.params.id;

    Contact.delete(contactId, (err, result) => {
        if (err) return res.status(500).json({ message: 'Contact deletion failed' });
        res.json({ message: 'Contact deleted successfully' });
    });
};

// Search contacts by name or phone number
const searchContacts = async (req, res) => {
    const { query } = req.query;
    if (!query || query.trim() === '') {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const searchValue = `%${query}%`; // For partial matches using LIKE

        // SQL query to search by name or phone
        const sql = `
            SELECT * FROM contacts 
            WHERE user_id = ? 
            AND (LOWER(name) LIKE LOWER(?) OR phone LIKE ?)   
        `;

        db.query(sql, [req.user.id, searchValue, searchValue], (err, results) => {
            if (err) {
                console.error('Error searching contacts:', err);
                return res.status(500).json({ message: 'Server error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'Contact not found' });
            }

            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error in searchContacts:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createContact, getContacts, updateContact, deleteContact, getContact, searchContacts };