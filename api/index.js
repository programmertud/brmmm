import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
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
app.post(['/api/auth/login', '/auth/login'], async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Login Attempt - Received:", { username, hasPassword: !!password });
        
        const cleanUser = (username || "").replace(/[^\x20-\x7E]/g, "").trim().toLowerCase();
        const cleanPass = (password || "").replace(/[^\x20-\x7E]/g, "").trim();

        console.log("Login Attempt - Cleaned:", { cleanUser, passMatch: cleanPass === "rizal12345" });

        // 1. EMERGENCY FALLBACK
        if (cleanUser === "admin" && (cleanPass === "admin123" || cleanPass === "rizal12345")) {
            console.log("Emergency Admin login successful.");
            return res.json({ username: "admin", role: "admin" });
        }
        
        // 2. Regular Login
        const { data: user, error } = await supabase.from('users').select('*').eq('username', cleanUser).single();
        if (user && user.password === cleanPass) {
             console.log("Regular login successful for:", cleanUser);
             return res.json({ username: user.username, role: user.role });
        }
        
        console.warn("Login failed for:", cleanUser);
        res.status(401).json({ message: "Invalid credentials. Please check your username and password." });
    } catch (err) {
        console.error("Login Server Error:", err.message);
        res.status(500).json({ message: "Server error: " + err.message });
    }
});

// Applications Routes (With Mapping)
app.get(['/api/applications', '/applications'], async (req, res) => {
    const { data } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
    res.json(data || []);
});

app.get(['/api/applications/:refId', '/applications/:refId'], async (req, res) => {
    const { refId } = req.params;
    const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('reference_id', refId)
        .single();
    
    if (error || !data) return res.status(404).json({ message: "Not found" });
    res.json(data);
});

app.post(['/api/applications', '/applications'], async (req, res) => {
    try {
        const referenceId = "REF-" + Math.random().toString(36).substr(2, 9).toUpperCase();
        const payload = req.body;
        
        const newApp = {
            reference_id: referenceId,
            first_name: payload.full_name || payload.fullName || payload.name || "Resident",
            last_name: "Application",
            service_type: payload.certificate_type || payload.certificateType || "General",
            status: "Pending",
            created_at: new Date().toISOString(),
            details: payload 
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
app.get(['/api/complaints', '/complaints'], async (req, res) => {
    const { data } = await supabase.from('complaints').select('*').order('created_at', { ascending: false });
    res.json(data || []);
});

app.post(['/api/complaints', '/complaints'], async (req, res) => {
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
app.get(['/api/announcements', '/announcements'], async (req, res) => {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    res.json(data || []);
});

app.post(['/api/announcements', '/announcements'], async (req, res) => {
    try {
        const payload = req.body;
        const title = payload.title || "No Title";
        const contentStr = payload.description || payload.desc || payload.message || "No Content";
        const now = new Date().toISOString();

        console.log("Announcement Fallback Loop Start:", { title });

        // TRY 1: Try 'description'
        const { data: d1, error: e1 } = await supabase.from('announcements').insert([{ title, description: contentStr, created_at: now }]).select();
        if (!e1) return res.status(201).json(d1[0]);

        // TRY 2: Try 'desc'
        const { data: d2, error: e2 } = await supabase.from('announcements').insert([{ title, desc: contentStr, created_at: now }]).select();
        if (!e2) return res.status(201).json(d2[0]);

        // TRY 3: Try 'content'
        const { data: d3, error: e3 } = await supabase.from('announcements').insert([{ title, content: contentStr, created_at: now }]).select();
        if (!e3) return res.status(201).json(d3[0]);

        // If ALL fail, throw the error
        throw e1 || e2 || e3;

    } catch (err) {
        console.error("Announcement Final Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// --- Applications Actions ---
app.patch(['/api/applications/:id/status', '/applications/:id/status'], async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const { data, error } = await supabase
            .from('applications')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete(['/api/applications/:id', '/applications/:id'], async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('applications').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Complaints Actions ---
app.patch(['/api/complaints/:id', '/complaints/:id'], async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const { data, error } = await supabase
            .from('complaints')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete(['/api/complaints/:id', '/complaints/:id'], async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('complaints').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete(['/api/announcements/:id', '/announcements/:id'], async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('announcements').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default app;
