const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const db = require('../config/db');

// username, email, and password are required fields

const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        console.log(req.body);

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Check if the email is already registered
        const existingUser = await User.findByEmail(email);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            email,
            password: hashedPassword, // Storing hashed password
            username: username || null
        };

        // Insert user into the database
        const createdUser = await User.create(newUser);

        // Send a success response
        return res.status(201).json({ message: 'User registered successfully', user: createdUser });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Use await to wait for the result from findByEmail
        const result = await User.findByEmail(email);

        // If no user is found, return an error
        if (!result || result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result[0];

        // Compare the PASSWORD with the hashed PASSWORD
        const validPassword = await bcrypt.compare(password, user.PASSWORD);

        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '360d' });

        // Respond with the token
        res.json({ token });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

getProfile = (req, res) => {
    const userId = req.user.id; // user is set in the JWT middleware

    const sql = `SELECT username, email, full_name, profile_picture_url FROM users WHERE id = ?`;
    
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching user profile:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(result[0]); // Return the user's profile information
    });
};

const updateProfile = (req, res) => {
    const userId = req.user.id;
    const updatedData = req.body;

    User.updateProfile(userId, updatedData, (err, result) => {
        if (err) return res.status(500).json({ message: 'Profile update failed' });
        res.json({ message: 'Profile updated successfully' });
    });
};

module.exports = { register, login, updateProfile, getProfile };