export default class ClientModel {
  constructor(db) {
    this.db = db;
  }

  async register(email, password, dateOfBirth, phoneNumber) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO users (email, password, date_of_birth, phone_number) VALUES (?, ?, ?, ?)`,
        [email, password, dateOfBirth, phoneNumber],
        (err) => {
          if (err) {
            console.error('Error inserting user:', err.message);
            return reject(err);
          }
          console.log('User registered successfully');
          resolve();
        }
      );
    });
  }

  async login(email, password) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM users WHERE email = ? AND password = ?`,
        [email, password],
        (err, row) => {
          if (err) {
            console.error('Error during login:', err.message);
            return reject(err);
          }
          if (!row) {
            return reject(new Error('Invalid email or password'));
          }
          console.log('Login successful');
          resolve(row);
        }
      );
    });
  }

  async getCurrentUser(userId) {
    return new Promise((resolve, reject) => {
      if (!userId) {
        return reject(new Error('No user ID provided'));
      }
      this.db.get(
        `SELECT * FROM users WHERE id = ?`,
        [userId],
        (err, row) => {
          if (err) {
            console.error('Error fetching current user:', err.message);
            return reject(err);
          }
          if (!row) {
            return reject(new Error('User not found'));
          }
          resolve(row);
        }
      );
    });
  }

  async updateProfile(userId, email, password, dateOfBirth, phoneNumber) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE users SET email = ?, password = ?, date_of_birth = ?, phone_number = ? WHERE id = ?`,
        [email, password, dateOfBirth, phoneNumber, userId],
        (err) => {
          if (err) {
            console.error('Error updating profile:', err.message);
            return reject(err);
          }
          console.log('Profile updated successfully');
          resolve();
        }
      );
    });
  }
}