import express from 'express';
import cors from 'cors';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Vercel path handling
const DB_FILE = path.join(process.cwd(), 'backend', 'db.json');

app.use(cors());
app.use(express.json());

// Helper to read/write DB
const readDB = () => {
    try {
        if (!fs.existsSync(DB_FILE)) {
            return {
                users: [{ username: "admin", password: bcrypt.hashSync("admin123", 10), role: "admin" }],
                applications: [], complaints: [], announcements: []
            };
        }
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (err) {
        console.error("DB Read Error:", err);
        return { users: [], applications: [], complaints: [], announcements: [] };
    }
};

const writeDB = (data) => {
    try {
        // NOTE: This will fail on Vercel production as it's read-only
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.warn("DB Write Warning (Likely read-only filesystem):", err.message);
    }
};

// Auth Routes
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.username === username);

    if (user && bcrypt.compareSync(password, user.password)) {
        return res.json({ username: user.username, role: user.role });
    }
    res.status(401).json({ message: "Invalid credentials" });
});

app.post('/api/auth/change-password', (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.username === username);

    if (userIndex === -1) return res.status(404).json({ message: "User not found" });

    const user = db.users[userIndex];
    if (!bcrypt.compareSync(oldPassword, user.password)) {
        return res.status(401).json({ message: "Incorrect old password" });
    }

    db.users[userIndex].password = bcrypt.hashSync(newPassword, 10);
    writeDB(db);
    res.json({ message: "Password updated successfully" });
});

// Applications Routes
app.get('/api/applications', (req, res) => {
    const db = readDB();
    res.json(db.applications || []);
});

app.post('/api/applications', (req, res) => {
    const db = readDB();
    const referenceId = "REF-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    const newApp = {
        ...req.body,
        reference_id: referenceId,
        status: "Pending",
        created_at: new Date().toISOString()
    };
    if (!db.applications) db.applications = [];
    db.applications.push(newApp);
    writeDB(db);
    res.status(201).json(newApp);
});

// Complaints
app.get('/api/complaints', (req, res) => {
    const db = readDB();
    res.json(db.complaints || []);
});

app.post('/api/complaints', (req, res) => {
    const db = readDB();
    const newComplaint = {
        ...req.body,
        created_at: new Date().toISOString()
    };
    if (!db.complaints) db.complaints = [];
    db.complaints.push(newComplaint);
    writeDB(db);
    res.status(201).json(newComplaint);
});

// Announcements
app.get('/api/announcements', (req, res) => {
    const db = readDB();
    res.json(db.announcements || []);
});

app.post('/api/announcements', (req, res) => {
    const db = readDB();
    const newAnnouncement = {
        ...req.body,
        created_at: new Date().toISOString()
    };
    if (!db.announcements) db.announcements = [];
    db.announcements.push(newAnnouncement);
    writeDB(db);
    res.status(201).json(newAnnouncement);
});

export default app;
