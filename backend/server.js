
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const supabase = require('./supabaseClient');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// HOME API
app.get('/', (req, res) => {
    res.send('Blog Application Backend is Running!');
});

// AUTHENTICATION HELPER
async function authenticateUser(req, res) {
    const authHeader = req.headers.authorization;

    const token = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    if (!token) {
        res.status(401).json({ message: 'Authentication token required' });
        return null;
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        res.status(401).json({ message: 'Invalid authentication token' });
        return null;
    }

    return data.user;
}

// REGISTER API
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
    });

    if (error) {
        return res.status(400).json({ message: error.message });
    }

    res.status(201).json({
        message: 'Registration successful',
        user: data.user
    });
});

// LOGIN API
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required'
        });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        return res.status(401).json({ message: error.message });
    }

    res.status(200).json({
        message: 'Login successful',
        user: data.user,
        session: data.session
    });
});

// CREATE BLOG API
app.post('/api/blogs', async (req, res) => {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
        return res.status(400).json({
            message: 'Title, content and category are required'
        });
    }

    const user = await authenticateUser(req, res);
    if (!user) return;

    const { data, error } = await supabase
        .from('blogs')
        .insert([{
            title,
            content,
            category,
            user_id: user.id
        }])
        .select()
        .single();

    if (error) {
        return res.status(500).json({ message: error.message });
    }

    res.status(201).json({
        message: 'Blog created successfully',
        blog: data
    });
});

// GET ALL BLOGS API
app.get('/api/blogs', async (req, res) => {
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return res.status(500).json({ message: error.message });
    }

    res.status(200).json(data);
});

// GET SINGLE BLOG API
app.get('/api/blogs/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', req.params.id)
        .single();

    if (error) {
        return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(data);
});

// UPDATE BLOG API
app.put('/api/blogs/:id', async (req, res) => {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
        return res.status(400).json({
            message: 'Title, content and category are required'
        });
    }

    const user = await authenticateUser(req, res);
    if (!user) return;

    const { data, error } = await supabase
        .from('blogs')
        .update({ title, content, category })
        .eq('id', req.params.id)
        .eq('user_id', user.id)
        .select()
        .maybeSingle();

    if (error) {
        return res.status(500).json({ message: error.message });
    }

    if (!data) {
        return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({
        message: 'Blog updated successfully',
        blog: data
    });
});

// DELETE BLOG API
app.delete('/api/blogs/:id', async (req, res) => {
    const user = await authenticateUser(req, res);
    if (!user) return;

    const { data, error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', req.params.id)
        .eq('user_id', user.id)
        .select()
        .maybeSingle();

    if (error) {
        return res.status(500).json({ message: error.message });
    }

    if (!data) {
        return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({ message: 'Blog deleted successfully' });
});

// SUPABASE CONNECTION TEST
async function testSupabase() {
    const { error } = await supabase.from('blogs').select('*');

    if (error) {
        console.log('Supabase Error:', error.message);
    } else {
        console.log('Supabase Connected Successfully!');
    }
}

// START SERVER
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    testSupabase();
});
