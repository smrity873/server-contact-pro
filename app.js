const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const { authenticateToken } = require('./middleware/authMiddleware');

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

// Apply middleware
app.use(express.json());  // This will parse incoming JSON request bodies
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Contact Keeper API');
});

app.use('/auth', authRoutes);
app.use('/contacts', authenticateToken, contactRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});