const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const saltRounds = 10;

app.use(cors({ origin: 'http://localhost:3001' })); 
app.use(express.json());

let db = new sqlite3.Database('./mydatabase.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Could not connect to database:', err.message);
    return;
  }
  console.log('Connected to the SQLite database.');
});

function addColumn(columnName, columnType) {
  const query = `ALTER TABLE rooms ADD COLUMN ${columnName} ${columnType};`;
  db.run(query, (err) => {
      if (err) {
          console.error(`Error adding column ${columnName}:`, err.message);
      } else {
          console.log(`Column ${columnName} added successfully.`);
      }
  });
}
function insertRoom(name, floor, building, seats, type, map_link, latitude, longitude) {
  const query = `INSERT INTO rooms (name, floor, building, seats, type, map_link, latitude, longitude)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
  db.run(query, [name, floor, building, seats, type, map_link, latitude, longitude], (err) => {
      if (err) {
          console.error('Error inserting new room:', err.message);
      } else {
          console.log('New room inserted successfully.');
      }
  });
}
//insertRoom('Sala Laborator 201', 3, 'UVT', 75, 'laborator', 'http://localhost:3001/sala/4', 45.74704213207934, 21.231360853263507);
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

db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    salaID INTEGER NOT NULL,
    date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    requester_name TEXT NOT NULL,
    contact TEXT NOT NULL,
    participants INTEGER,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
  if (err) {
    console.error('Error creating bookings table:', err.message);
  } else {
    console.log('Bookings table created or already exists.');
  }
});

db.run(`CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    floor INTEGER NOT NULL,
    building TEXT NOT NULL,
    seats INTEGER NOT NULL,
    type TEXT,
    map_link TEXT
)`, (err) => {
  if (err) {
    console.error('Error creating rooms table:', err.message);
  } else {
    console.log('Rooms table created or already exists.');
  }
});

db.run(`CREATE TABLE IF NOT EXISTS form (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL
)`, (err) => {
if (err) {
  console.error('Error creating rooms table:', err.message);
} else {
  console.log('Rooms table created or already exists.');
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
      res.status(201).json({ message: 'User created successfully', userId: this.lastID });
    });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        res.json({
          message: 'Login successful',
          username: user.username,
          email: user.email,
        });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    });
  });
});


app.post('/bookings', (req, res) => {
  const { date, start_time, end_time, requester_name, contact,  participants, status, salaId } = req.body;

  db.run(`INSERT INTO bookings (date, start_time, end_time, requester_name, contact, participants, status, salaID) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [date, start_time, end_time, requester_name, contact, participants, status, salaId],
    function(err) {
      if (err) {
        console.error("Error inserting booking into database:", err);
        res.status(400).json({ error: 'Error creating booking' });
        return;
      }
      res.status(201).json({ message: 'Booking created successfully', bookingId: this.lastID });
    });
});

app.post('/rooms', (req, res) => {
  const { name, floor, building, seats, type, map_link, latitude, longitude } = req.body;

  db.run(`INSERT INTO rooms (name, floor, building, seats, type, map_link, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, floor, building, seats, type, map_link, latitude, longitude],
    function(err) {
      if (err) {
        console.error("Error inserting room into database:", err);
        res.status(400).json({ error: 'Error creating room' });
        return;
      }
      res.status(201).json({ message: 'Room created successfully', roomId: this.lastID });
    });
});

app.post('/submit-form', (req, res) => {
  const { name, email, message } = req.body;

  db.run(`INSERT INTO form (name, email, message) VALUES (?, ?, ?)`, 
    [name, email, message],
    function(err) {
      if (err) {
        console.error("Error inserting contact form data into database:", err);
        res.status(400).json({ error: 'Error submitting contact form' });
        return;
      }
      res.status(201).json({ message: 'Contact form submitted successfully', formId: this.lastID });
    });
});
app.get('/events/:salaId', (req, res) => {
  const { salaId } = req.params;
  if (!salaId) {
    return res.status(400).send("Invalid salaId provided.");
  }

  const sql = "SELECT * FROM bookings WHERE salaID = ?";
  db.all(sql, [salaId], (err, rows) => {
    if (err) {
      console.error('Error fetching bookings:', err.message);
      res.status(500).send("Error fetching bookings");
    } else {
      res.json(rows);
    }
  });
});

app.get('/rooms', (req, res) => {
  db.all('SELECT * FROM rooms', [], (err, rows) => {
      if (err) {
          console.error("Error fetching rooms from database:", err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      res.json(rows);
  });
});
app.get('/events', (req, res) => {
  db.all('SELECT date, start_time, requester_name FROM bookings ORDER BY date, start_time', [], (err, rows) => {
    if (err) {
      console.error("Error fetching events from database:", err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    const events = rows.reduce((acc, row) => {
      if (!acc[row.date]) {
        acc[row.date] = {};
      }
      const startTime = new Date(`2024-01-01T${row.start_time}:00Z`); 
      startTime.setHours(startTime.getHours() + 1);
      const endTime = startTime.toISOString().substr(11, 5);
      acc[row.date][row.start_time] = `${row.requester_name} (${endTime})`;
      return acc;
    }, {});
    res.json(events);
  });
});
app.get('/', (req, res) => {
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
function updateRoomCoordinates(roomId, latitude, longitude) {
  const query = `UPDATE rooms SET latitude = ?, longitude = ? WHERE id = ?;`;
  db.run(query, [latitude, longitude, roomId], function(err) {
      if (err) {
          return console.error('Error updating room coordinates:', err.message);
      }
      console.log(`Row(s) updated: ${this.changes}`);
  });
}

updateRoomCoordinates(4, 45.74708479226844, 21.230525411790115);
app.get('/rooms-map', (req, res) => {
  db.all("SELECT * FROM rooms", [], (err, rows) => {
      if (err) {
          res.status(500).send('Error fetching rooms from database');
          return;
      }
      res.json(rows);
  });
});
db.all('SELECT * FROM rooms', [], (err, rows) => {
  if (err) {
    return console.error(err.message);
  }
  rows.forEach((row) => {
    console.log(row);
  });
});
/*
db.all('SELECT * FROM users', [], (err, rows) => {
  if (err) {
    return console.error(err.message);
  }
  rows.forEach((row) => {
    console.log(row);
  });
});*/
/*db.all('SELECT * FROM bookings', [], (err, rows) => {
  if (err) {
    return console.error(err.message);
  }
  rows.forEach((row) => {
    console.log(row);
  });
});*/
db.all('SELECT * FROM form', [], (err, rows) => {
  if (err) {
    return console.error(err.message);
  }
  rows.forEach((row) => {
    console.log(row);
  });
});
/*db.run(`UPDATE rooms SET name = ?, floor = ?, building = ?, seats = ?, type = ? WHERE id = ?`, ['Laboratory Room 135', 1, 'FEAA', 15, 'laboratory', 5], function(err) {
  if (err) {
      return console.error(err.message);
  }
  console.log(`Row(s) updated: ${this.changes}`);
});*/
db.run(`UPDATE rooms SET name = ? WHERE id = ?`, ['Conference A1', 2], function(err) {
  if (err) {
      return console.error(err.message);
  }
  console.log(`Row(s) updated: ${this.changes}`);
});
/*db.run(`DELETE FROM rooms WHERE id = ?`, 6, function(err) {
  if (err) {
      return console.error(err.message);
  }
  console.log(`Row(s) deleted: ${this.changes}`);
});*/