const express = require('express');
const { createContact, getContacts, updateContact, deleteContact, getContact, searchContacts } = require('../controllers/contactController');
const router = express.Router();

router.get('/', getContacts);             // Get all contacts for the logged-in user
router.get('/:id', getContact);
router.get('/search', searchContacts);   // Search contacts by name or phone number
router.post('/', createContact);          // Create a new contact
router.put('/:id', updateContact);        // Update a contact by ID
router.delete('/:id', deleteContact);     // Delete a contact by ID

module.exports = router;