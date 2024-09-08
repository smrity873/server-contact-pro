const Contact = require('../models/Contact');

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

module.exports = { createContact, getContacts, updateContact, deleteContact };