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

// 🔍 Ping route to check if API and Database are alive
app.get('/api/ping', async (req, res) => {
    try {
        const { data, error } = await supabase.from('users').select('count');
        if (error) throw error;
        res.json({ 
            status: "alive", 
            database: "connected",
            message: "Barangay API and Database are working!" 
        });
    } catch (err) {
        res.status(500).json({ 
            status: "alive", 
            database: "error", 
            error: err.message,
            message: "API is alive but Database connection failed!" 
        });
    }
});

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Aggressively remove invisible characters and spaces
    const cleanUser = (username || "").replace(/[^\x20-\x7E]/g, "").trim().toLowerCase();
    const cleanPass = (password || "").replace(/[^\x20-\x7E]/g, "").trim();

    console.log(`Login attempt for: [${cleanUser}] (length: ${cleanUser.length})`);
    console.log(`Password length: ${cleanPass.length}`);

    // 1. DIRECT FALLBACK
    if (cleanUser === "admin" && (cleanPass === "admin123" || cleanPass === "rizal12345")) {
        console.log("Emergency Admin login successful.");
        return res.json({ username: "admin", role: "admin" });
    }
    
    // 2. Supabase Check (If fallback doesn't match)
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', lowerUser)
            .single();

        if (user && user.password === cleanPass) {
             return res.json({ username: user.username, role: user.role });
        }
    } catch (err) {
        console.error("Supabase error:", err);
    }

    res.status(401).json({ message: "Invalid credentials" });
});

// Applications Routes
app.get('/api/applications', async (req, res) => {
    const { data } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
    res.json(data || []);
});

app.post('/api/applications', async (req, res) => {
    const referenceId = "REF-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    const newApp = { ...req.body, reference_id: referenceId, status: "Pending", created_at: new Date().toISOString() };
    const { data, error } = await supabase.from('applications').insert([newApp]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
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
