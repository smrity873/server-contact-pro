const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
    const { username, email, full_name, password, profile_picture_url } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    User.create({ username, email, full_name, password: hashedPassword, profile_picture_url }, (err, result) => {
        if (err) return res.status(500).json({ message: 'User creation failed' });
        res.status(201).json({ message: 'User registered successfully' });
    });
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

const updateProfile = (req, res) => {
    const userId = req.user.id;
    const updatedData = req.body;

    User.updateProfile(userId, updatedData, (err, result) => {
        if (err) return res.status(500).json({ message: 'Profile update failed' });
        res.json({ message: 'Profile updated successfully' });
    });
};

module.exports = { register, login, updateProfile };