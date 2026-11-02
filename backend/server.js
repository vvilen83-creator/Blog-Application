
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const supabase = require('./supabaseClient');

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// REGISTER
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name }
        }
    });

    if (error) {
        return res.status(400).json({ message: error.message });
    }

    res.json({ message: 'Registration successful', data });
});

// LOGIN
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        return res.status(400).json({ message: error.message });
    }

    res.json({ session: data.session, user: data.user });
});

// AUTHENTICATION MIDDLEWARE
async function authenticateUser(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Please login first' });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = data.user;
    next();
}

// GET ALL BLOGS
app.get('/api/blogs', async (req, res) => {
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
});

// CREATE BLOG
app.post('/api/blogs', authenticateUser, async (req, res) => {
    const { title, content, category } = req.body;

    const { data, error } = await supabase
        .from('blogs')
        .insert([{
            title,
            content,
            category,
            user_id: req.user.id
        }])
        .select();

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
});

// UPDATE BLOG
app.put('/api/blogs/:id', authenticateUser, async (req, res) => {
    const { title, content, category } = req.body;

    const { data, error } = await supabase
        .from('blogs')
        .update({ title, content, category })
        .eq('id', req.params.id)
        .eq('user_id', req.user.id)
        .select();

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
});

// DELETE BLOG
app.delete('/api/blogs/:id', authenticateUser, async (req, res) => {
    const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', req.params.id)
        .eq('user_id', req.user.id);

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: 'Blog deleted successfully' });
});

// GET USER PROFILE
app.get('/api/profile', authenticateUser, async (req, res) => {
    const user = req.user;

    res.json({
        name: user.user_metadata?.name || '',
        email: user.email,
        id: user.id,
        photoUrl: user.user_metadata?.avatar_url || ''
    });
});

// UPDATE USER PROFILE
app.put('/api/profile', authenticateUser, async (req, res) => {
    const { name } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const { data, error } = await supabase.auth.admin.updateUserById(
        req.user.id,
        {
            user_metadata: {
                ...req.user.user_metadata,
                name: name.trim()
            }
        }
    );

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({
        message: 'Profile updated successfully',
        user: data.user
    });
});

// UPLOAD PROFILE PHOTO
app.post(
    '/api/profile/photo',
    authenticateUser,
    upload.single('photo'),
    async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: 'Please select a photo' });
        }

        const extension = req.file.mimetype.split('/')[1];
        const filePath = `${req.user.id}/profile.${extension}`;

        const { error } = await supabase.storage
            .from('profile-photos')
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: true
            });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        const { data } = supabase.storage
            .from('profile-photos')
            .getPublicUrl(filePath);

        // Save photo URL in user metadata
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            req.user.id,
            {
                user_metadata: {
                    ...req.user.user_metadata,
                    avatar_url: data.publicUrl
                }
            }
        );

        if (updateError) {
            return res.status(400).json({ error: updateError.message });
        }

        res.json({ photoUrl: data.publicUrl });
    }
);

// ERROR HANDLER
app.use((err, req, res, next) => {
    res.status(400).json({ error: err.message });
});

// START SERVER
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
