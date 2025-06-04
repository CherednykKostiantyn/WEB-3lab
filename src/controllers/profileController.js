export default class ProfileController {
  constructor(db) {
    this.db = db;
  }

  async getProfile(req, res) {
    const { id } = req.params;
    try {
      const user = await new Promise((resolve, reject) => {
        this.db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
          if (err) {
            return reject(err);
          }
          resolve(row);
        });
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ user });
    } catch (err) {
      console.error('Error in getProfile:', err.message);
      res.status(500).json({ error: err.message });
    }
  }

  async updateProfile(req, res) {
    const { id } = req.params;
    const { email, password, date_of_birth, phone_number, surname, firstName, middleName, gender } = req.body;
    try {
      const user = await new Promise((resolve, reject) => {
        this.db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
          if (err) {
            return reject(err);
          }
          resolve(row);
        });
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Перевірка унікальності email
      if (email && email !== user.email) {
        const existingUser = await new Promise((resolve, reject) => {
          this.db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
            if (err) {
              return reject(err);
            }
            resolve(row);
          });
        });
        if (existingUser) {
          return res.status(400).json({ error: 'Email already exists' });
        }
      }

      const updateQuery = `
        UPDATE users
        SET email = COALESCE(?, email),
            password = COALESCE(?, password),
            date_of_birth = COALESCE(?, date_of_birth),
            phone_number = COALESCE(?, phone_number),
            surname = COALESCE(?, surname),
            firstName = COALESCE(?, firstName),
            middleName = COALESCE(?, middleName),
            gender = COALESCE(?, gender)
        WHERE id = ?
      `;
      await new Promise((resolve, reject) => {
        this.db.run(
          updateQuery,
          [email, password, date_of_birth, phone_number, surname, firstName, middleName, gender, id],
          (err) => {
            if (err) {
              return reject(err);
            }
            resolve();
          }
        );
      });

      const updatedUser = await new Promise((resolve, reject) => {
        this.db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
          if (err) {
            return reject(err);
          }
          resolve(row);
        });
      });

      console.log('Updated user:', updatedUser);
      res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (err) {
      console.error('Error in updateProfile:', err.message);
      res.status(500).json({ error: err.message });
    }
  }
}