import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt for: ${username}`);

    // 1. EMERGENCY FALLBACK (No external libraries needed)
    const lowerUser = username.toLowerCase();
    if (lowerUser === "admin" && (password === "admin123" || password === "rizal12345")) {
        console.log("Emergency Admin login successful.");
        return res.json({ username: "admin", role: "admin" });
    }
    
    // 2. Regular Supabase Login
    try {
        const bcrypt = await import('bcryptjs').then(m => m.default || m);
        
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !user) {
            console.log("User not found or Supabase error.");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (bcrypt.compareSync(password, user.password)) {
            console.log("Supabase login successful.");
            return res.json({ username: user.username, role: user.role });
        }
    } catch (err) {
        console.error("Login processing error:", err);
    }

    res.status(401).json({ message: "Invalid credentials" });
});

app.post('/api/auth/change-password', async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    try {
        const bcrypt = await import('bcryptjs').then(m => m.default || m);
        
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !user) return res.status(404).json({ message: "User not found" });

        if (!bcrypt.compareSync(oldPassword, user.password)) {
            return res.status(401).json({ message: "Incorrect old password" });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await supabase
            .from('users')
            .update({ password: hashedPassword })
            .eq('username', username);

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Applications Routes
app.get('/api/applications', async (req, res) => {
    const { data } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
    res.json(data || []);
});

app.post('/api/applications', async (req, res) => {
    const referenceId = "REF-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    const newApp = {
        ...req.body,
        reference_id: referenceId,
        status: "Pending",
        created_at: new Date().toISOString()
    };
    const { data, error } = await supabase.from('applications').insert([newApp]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

app.patch('/api/applications/:referenceId/status', async (req, res) => {
    const { data, error } = await supabase
        .from('applications')
        .update({ status: req.body.status })
        .eq('reference_id', req.params.referenceId)
        .select()
        .single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Complaints
app.get('/api/complaints', async (req, res) => {
    const { data } = await supabase.from('complaints').select('*').order('created_at', { ascending: false });
    res.json(data || []);
});

app.post('/api/complaints', async (req, res) => {
    const newComplaint = { ...req.body, created_at: new Date().toISOString() };
    const { data, error } = await supabase.from('complaints').insert([newComplaint]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// Announcements
app.get('/api/announcements', async (req, res) => {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    res.json(data || []);
});

app.post('/api/announcements', async (req, res) => {
    const newAnnouncement = { ...req.body, created_at: new Date().toISOString() };
    const { data, error } = await supabase.from('announcements').insert([newAnnouncement]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

export default app;
