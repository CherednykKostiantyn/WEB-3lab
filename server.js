import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import AuthController from './src/controllers/authController.js';
import ProfileController from './src/controllers/profileController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/favicon.ico', (req, res) => res.status(204).end());

const db = new sqlite3.Database('database/questify.db', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      date_of_birth TEXT,
      phone_number TEXT,
      surname TEXT,
      firstName TEXT,
      middleName TEXT,
      gender TEXT
    )`, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
      } else {
        console.log('Users table is ready.');
      }
    });
  }
});

const authController = new AuthController(db);
const profileController = new ProfileController(db);

app.post('/api/register', async (req, res) => {
  console.log('Received register request:', req.body);
  try {
    await authController.register(req, res);
  } catch (err) {
    console.error('Server error in register:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  console.log('Received login request:', req.body);
  try {
    await authController.login(req, res);
  } catch (err) {
    console.error('Server error in login:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/profile/:id', async (req, res) => {
  console.log('Received profile request:', req.params);
  await profileController.getProfile(req, res);
});

app.put('/api/profile/:id', async (req, res) => {
  console.log('Received profile update request:', req.params, req.body);
  await profileController.updateProfile(req, res);
});

const clientPath = path.join(__dirname, 'dist');
app.use(express.static(clientPath));

app.get('*', (req, res) => {
  console.log('Serving index.html for SPA route');
  res.sendFile(path.join(clientPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});