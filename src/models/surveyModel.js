const sqlite3 = require('sqlite3').verbose();

class SurveyModel {
  constructor(db) {
    this.db = db;
    this.initializeTable();
  }

  initializeTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS surveys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);
  }

  createSurvey({ userId, question, answer }) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO surveys (userId, question, answer) VALUES (?, ?, ?)`,
        [userId, question, answer],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, userId, question, answer });
        }
      );
    });
  }

  findByUserId(userId) {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM surveys WHERE userId = ?`, [userId], (err, surveys) => {
        if (err) reject(err);
        else resolve(surveys);
      });
    });
  }
}

module.exports = SurveyModel;