const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydatabase.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Error when connecting to the database', err.message);
  } else {
    console.log('Connected to the database.');
  }
});

const name = "Amfiteatrul";
const floor = 3;
const building = "UVT";
const seats = 50;
const type = "Amfiteatru";

db.run(`INSERT INTO rooms (name, floor, building, seats, type) VALUES (?, ?, ?, ?, ?)`, 
  [name, floor, building, seats, type], 
  function(err) {
    if (err) {
      console.error("Error inserting room into database:", err.message);
    } else {
      console.log(`A new room has been inserted with rowid: ${this.lastID}`);
    }
});

/*const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const saltRounds = 10;

app.use(cors());
app.use(express.json());

let db = new sqlite3.Database('./mydatabase.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Could not connect to database:', err.message);
    return;
  }
  console.log('Connected to the SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
  if (err) {
    console.error('Error creating users table:', err.message);
  } else {
    console.log('Users table created or already exists.');
  }
});

app.post('/signup', (req, res) => {
  console.log("Received signup request:", req.body);
  const { username, email, password } = req.body;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  
    db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`, [username, email, hash], function(err) {
      if (err) {
        console.error("Error inserting user into database:", err);
        res.status(400).json({ error: 'Email or username already exists' });
        return;
      }
      res.status(201).json({ message: 'User created successfully' });
    });
  });
});
db.all('SELECT * FROM users', [], (err, rows) => {
  if (err) {
    return console.error(err.message);
  }
  rows.forEach((row) => {
    console.log(row);
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err || !user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});*/
