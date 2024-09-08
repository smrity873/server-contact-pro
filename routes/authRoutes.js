const express = require('express');
const { register, login, updateProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;