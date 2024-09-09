const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('express').json;
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const { authenticateToken } = require('./middleware/authMiddleware');
const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(cors());
app.use(bodyParser());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Contact Keeper API');
});

app.use('/auth', authRoutes); // User registration & login
app.use('/contacts', authenticateToken, contactRoutes); // CRUD operations for contacts

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});