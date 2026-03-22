require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('./database');

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the parent directory (MAIN Portfolio)
app.use(express.static(path.join(__dirname, '..')));

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_dev_key_123';
// Default admin password is 'admin123', in a real app this hash should be in the DB or ENV
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);

// Endpoint to submit a new message
app.post('/api/messages', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const result = await db.query(
            'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING id',
            [name, email, message]
        );
        res.status(201).json({ success: true, id: result.rows[0].id });
    } catch (err) {
        console.error('POST /api/messages ERROR:', err.message);
        console.error('Full Error:', err);
        res.status(500).json({ error: 'Failed to save message.', details: err.message });
    }
});

// Endpoint for admin login
app.post('/api/login', (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Password required' });
    }

    if (bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
        const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, token });
    } else {
        res.status(401).json({ error: 'Invalid password' });
    }
});

// Middleware to authenticate admin
function verifyAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err || decoded.role !== 'admin') {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        next();
    });
}

// Endpoint to get all messages (Protected)
app.get('/api/messages', verifyAdmin, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM messages ORDER BY timestamp DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/messages ERROR:', err.message);
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
});

// Endpoint to delete a message (Protected)
app.delete('/api/messages/:id', verifyAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM messages WHERE id = $1', [id]);
        res.json({ success: true, changes: result.rowCount });
    } catch (err) {
        console.error('DELETE /api/messages ERROR:', err.message);
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
