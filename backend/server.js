import express from 'express';
import cors from 'cors';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5001;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Helper to read/write DB
const readDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        const initialDB = {
            users: [
                {
                    username: "admin",
                    password: bcrypt.hashSync("admin123", 10),
                    role: "admin"
                }
            ],
            applications: [],
            complaints: [],
            announcements: []
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2));
        return initialDB;
    }
    return JSON.parse(fs.readFileSync(DB_FILE));
};

const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
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

app.post('/api/auth/register', (req, res) => {
    const { username, password } = req.body;
    const db = readDB();

    if (db.users.find(u => u.username === username)) {
        return res.status(400).json({ message: "User already exists" });
    }

    const newUser = {
        username,
        password: bcrypt.hashSync(password, 10),
        role: "secretary"
    };

    db.users.push(newUser);
    writeDB(db);
    res.status(201).json({ username: newUser.username, role: newUser.role });
});

app.post('/api/auth/change-password', (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.username === username);

    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }

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
    res.json(db.applications);
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
    db.applications.push(newApp);
    writeDB(db);
    res.status(201).json(newApp);
});

app.get('/api/applications/:referenceId', (req, res) => {
    const db = readDB();
    const app = db.applications.find(a => a.reference_id === req.params.referenceId);
    if (app) return res.json(app);
    res.status(404).json({ message: "Application not found" });
});

app.patch('/api/applications/:referenceId/status', (req, res) => {
    const db = readDB();
    const appIndex = db.applications.findIndex(a => a.reference_id === req.params.referenceId);
    if (appIndex !== -1) {
        db.applications[appIndex].status = req.body.status;
        writeDB(db);
        return res.json(db.applications[appIndex]);
    }
    res.status(404).json({ message: "Application not found" });
});

// Complaints
app.get('/api/complaints', (req, res) => {
    const db = readDB();
    res.json(db.complaints);
});

app.post('/api/complaints', (req, res) => {
    const db = readDB();
    const newComplaint = {
        ...req.body,
        created_at: new Date().toISOString()
    };
    db.complaints.push(newComplaint);
    writeDB(db);
    res.status(201).json(newComplaint);
});

// Announcements
app.get('/api/announcements', (req, res) => {
    const db = readDB();
    res.json(db.announcements);
});

app.post('/api/announcements', (req, res) => {
    const db = readDB();
    const newAnnouncement = {
        ...req.body,
        created_at: new Date().toISOString()
    };
    db.announcements.push(newAnnouncement);
    writeDB(db);
    res.status(201).json(newAnnouncement);
});

// Initialize DB on startup
readDB();

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Database file: ${DB_FILE}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please kill the process using it.`);
    } else {
        console.error('Server error:', err);
    }
});

// Keep-alive interval to prevent some environments from exiting
setInterval(() => {}, 10000);
