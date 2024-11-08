import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('./tasks.db');
db.serialize(() => {
  db.run("DROP TABLE IF EXISTS tasks"); // This will remove the table if it exists
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY,
      title TEXT,
      description TEXT,
      status TEXT,
      important INTEGER DEFAULT 0
    )
  `);
});


// GET all tasks
app.get('/tasks', (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      console.error("Error retrieving tasks:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ tasks: rows });
  });
});

// POST a new task
app.post('/tasks', (req, res) => {
  const { title, description, status, important = 0 } = req.body;
  console.log("Received POST request data:", req.body);

  db.run("INSERT INTO tasks (title, description, status, important) VALUES (?, ?, ?, ?)", [title, description, status, important], function (err) {
    if (err) {
      console.error("Database error on insert:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

// PUT update a task
app.put('/tasks/:id', (req, res) => {
  const { title, description, status, important } = req.body;
  const { id } = req.params;
  console.log("Received PUT request data:", req.body);

  db.run("UPDATE tasks SET title = ?, description = ?, status = ?, important = ? WHERE id = ?", [title, description, status, important, id], function (err) {
    if (err) {
      console.error("Database error on update:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ updated: this.changes });
  });
});

// DELETE a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tasks WHERE id = ?", id, function (err) {
    if (err) {
      console.error("Database error on delete:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ deleted: this.changes });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get('/quote', async (req, res) => {
  try {
    const response = await fetch('https://zenquotes.io/api/random');
    const quoteData = await response.json();
    res.json(quoteData);
  } catch (error) {
    console.error("Failed to load quote:", error.message);
    res.status(500).json({ error: 'Failed to load quote' });
  }
});
