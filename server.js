const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('./database/questify.db', (err) => {
  if (err) {
    console.error('Помилка при підключенні до бази даних:', err.message);
    process.exit(1); 
  }
});


db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT NOT NULL,
      dob TEXT NOT NULL,
      gender TEXT NOT NULL,
      surname TEXT,
      firstName TEXT,
      middleName TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS surveys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);
});

app.post('/api/register', (req, res) => {
  const { email, password, phone, dob, gender } = req.body;
  if (!email || !password || !phone || !dob || !gender) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  }
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  db.run(
    'INSERT INTO users (email, password, phone, dob, gender) VALUES (?, ?, ?, ?, ?)',
    [email, password, phone, dob, gender],
    function (err) {
      if (err) {
        console.error('Помилка при вставці користувача:', err.message); 
        return res.status(500).json({ error: 'Error registering user' });
      }
      res.status(200).json({ message: 'Registration successful', userId: this.lastID });
    }
  );
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
    if (!row) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    res.status(200).json({ user: { id: row.id, email: row.email, phone: row.phone, dob: row.dob, gender: row.gender, surname: row.surname, firstName: row.firstName, middleName: row.middleName } });
  });
});

app.get('/api/profile/:userId', (req, res) => {
  const userId = req.params.userId;
  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }
    db.all('SELECT question, answer FROM surveys WHERE userId = ?', [userId], (err, surveys) => {
      res.status(200).json({ user: row, surveys: surveys || [] });
    });
  });
});

app.put('/api/profile/:userId', (req, res) => {
  const userId = req.params.userId;
  const { surname, firstName, middleName, email, phone, dob, gender } = req.body;
  db.run(
    'UPDATE users SET surname = ?, firstName = ?, middleName = ?, email = ?, phone = ?, dob = ?, gender = ? WHERE id = ?',
    [surname, firstName, middleName, email, phone, dob, gender, userId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error updating profile' });
      }
      res.status(200).json({ message: 'Profile updated successfully' });
    }
  );
});

app.post('/api/survey', (req, res) => {
  const { userId, question, answer } = req.body;
  db.get('SELECT * FROM surveys WHERE userId = ? AND question = ?', [userId, question], (err, row) => {
    if (row) {
      return res.status(400).json({ error: 'You have already answered this question' });
    }
    db.run(
      'INSERT INTO surveys (userId, question, answer) VALUES (?, ?, ?)',
      [userId, question, answer],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error saving survey' });
        }
        res.status(200).json({ message: 'Survey submitted successfully' });
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});