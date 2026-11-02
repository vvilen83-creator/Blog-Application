const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Home API
app.get('/', (req, res) => {
    res.send('Blog Application Backend is Running!');
});

// Registration API
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    res.status(201).json({
        message: 'User registered successfully',
        user: { name, email }
    });
});

// Login API
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required'
        });
    }

    if (email === 'biraja@gmail.com' && password === '123456') {
        return res.status(200).json({
            message: 'Login successful'
        });
    }

    return res.status(401).json({
        message: 'Invalid email or password'
    });
});

// Create Blog API
app.post('/api/blogs', (req, res) => {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    res.status(201).json({
        message: 'Blog created successfully',
        blog: { title, content, author }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
