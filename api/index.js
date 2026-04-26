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

// 🔍 Health Check
app.get('/api/ping', async (req, res) => {
    try {
        const { data, error } = await supabase.from('users').select('count');
        if (error) throw error;
        res.json({ status: "alive", database: "connected" });
    } catch (err) {
        res.status(500).json({ status: "alive", database: "error", error: err.message });
    }
});

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const cleanUser = (username || "").replace(/[^\x20-\x7E]/g, "").trim().toLowerCase();
    const cleanPass = (password || "").replace(/[^\x20-\x7E]/g, "").trim();

    // 1. EMERGENCY FALLBACK
    if (cleanUser === "admin" && (cleanPass === "admin123" || cleanPass === "rizal12345")) {
        console.log("Emergency Admin login successful.");
        return res.json({ username: "admin", role: "admin" });
    }
    
    // 2. Regular Login
    try {
        const { data: user, error } = await supabase.from('users').select('*').eq('username', cleanUser).single();
        if (user && user.password === cleanPass) {
             return res.json({ username: user.username, role: user.role });
        }
    } catch (err) {}
    res.status(401).json({ message: "Invalid credentials" });
});

// Applications Routes (With Mapping)
app.get('/api/applications', async (req, res) => {
    const { data } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
    res.json(data || []);
});

app.post('/api/applications', async (req, res) => {
    try {
        const referenceId = "REF-" + Math.random().toString(36).substr(2, 9).toUpperCase();
        const payload = req.body;
        
        const newApp = {
            reference_id: referenceId,
            first_name: payload.full_name || payload.fullName || "Resident",
            last_name: "Application",
            service_type: payload.certificate_type || payload.certificateType || "General",
            status: "Pending",
            created_at: new Date().toISOString(),
            details: payload // Save EVERYTHING in JSONB just in case
        };

        const { data, error } = await supabase.from('applications').insert([newApp]).select().single();
        if (error) {
            console.error("Supabase Application Error:", error.message);
            return res.status(500).json({ error: error.message });
        }
        res.status(201).json(data);
    } catch (err) {
        console.error("Server Application Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Complaints (With Mapping)
app.get('/api/complaints', async (req, res) => {
    const { data } = await supabase.from('complaints').select('*').order('created_at', { ascending: false });
    res.json(data || []);
});

app.post('/api/complaints', async (req, res) => {
    try {
        const payload = req.body;
        const newComplaint = {
            complainant: payload.name || payload.fullName || "Anonymous",
            subject: payload.subject || "No Subject",
            description: payload.message || payload.description || "No Content",
            status: "Pending",
            created_at: new Date().toISOString()
        };

        const { data, error } = await supabase.from('complaints').insert([newComplaint]).select().single();
        if (error) {
            console.error("Supabase Complaint Error:", error.message);
            return res.status(500).json({ error: error.message });
        }
        res.status(201).json(data);
    } catch (err) {
        console.error("Server Complaint Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Announcements
app.get('/api/announcements', async (req, res) => {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    res.json(data || []);
});

app.post('/api/announcements', async (req, res) => {
    const { data, error } = await supabase.from('announcements').insert([{ ...req.body, created_at: new Date().toISOString() }]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

export default app;
