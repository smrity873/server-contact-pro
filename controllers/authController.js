const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
    try {
        const { email, password, username, full_name, profile_picture_url } = req.body;

        console.log(req.body);

        // Validation: Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Check if the email is already registered
        User.findByEmail(email, async (err, existingUser) => {
            if (existingUser.length > 0) {
                return res.status(400).json({ message: 'Email is already registered.' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user, allowing optional fields (username, full_name, profile_picture_url)
            const newUser = {
                email,
                password: hashedPassword,
                username: username || null,               // If no username, set to null
                full_name: full_name || null,             // If no full_name, set to null
                profile_picture_url: profile_picture_url || null // If no profile picture, set to null
            };

            User.create(newUser, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'User creation failed.' });
                }
                res.status(201).json({ message: 'User registered successfully.' });
            });
        });

    } catch (error) {
        console.error('Error in user registration:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

const login = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, async (err, result) => {
        if (err || result.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = result[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
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