const sqlite3 = require('sqlite3').verbose();

class UserModel {
  constructor(db) {
    this.db = db;
    this.initializeTable();
  }

  initializeTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT NOT NULL,
        dob TEXT NOT NULL,
        gender TEXT NOT NULL,
        firstName TEXT,
        lastName TEXT,
        middleName TEXT
      )
    `);
  }

  createUser({ email, password, phone, dob, gender }) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO users (email, password, phone, dob, gender) VALUES (?, ?, ?, ?, ?)`,
        [email.trim(), password.trim(), phone, dob, gender],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, email, phone, dob, gender });
        }
      );
    });
  }

  findByEmailAndPassword(email, password) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM users WHERE LOWER(email) = LOWER(?) AND password = ?`,
        [email.trim(), password.trim()],
        (err, user) => {
          if (err) reject(err);
          else resolve(user);
        }
      );
    });
  }

  findById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });
  }

  updateUser(id, { surname, firstName, middleName, email, phone, dob, gender }) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE users SET surname = ?, firstName = ?, middleName = ?, email = ?, phone = ?, dob = ?, gender = ? WHERE id = ?`,
        [surname, firstName, middleName, email, phone, dob, gender, id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
}

module.exports = UserModel;