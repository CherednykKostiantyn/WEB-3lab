export default class AuthController {
  constructor(db) {
    this.db = db;
  }

  async register(req, res) {
    const { email, password, dateOfBirth, phoneNumber } = req.body;
    try {
      const existingUser = await new Promise((resolve, reject) => {
        this.db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
          if (err) {
            return reject(err);
          }
          resolve(row);
        });
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const result = await new Promise((resolve, reject) => {
        this.db.run(
          'INSERT INTO users (email, password, date_of_birth, phone_number) VALUES (?, ?, ?, ?)',
          [email, password, dateOfBirth, phoneNumber],
          function (err) {
            if (err) {
              return reject(err);
            }
            resolve(this.lastID);
          }
        );
      });

      res.status(201).json({ message: 'User registered successfully', userId: result });
    } catch (err) {
      console.error('Error in register:', err.message);
      res.status(500).json({ error: err.message });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await new Promise((resolve, reject) => {
        this.db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
          if (err) {
            return reject(err);
          }
          resolve(row);
        });
      });

      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      if (user.password !== password) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      res.json({ userId: user.id });
    } catch (err) {
      console.error('Error in login:', err.message);
      res.status(500).json({ error: err.message });
    }
  }
}