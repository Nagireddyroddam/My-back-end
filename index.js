const express = require('express');
const app = express();
const cors = require('cors');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todoapp',
  password: 'P@SS_wo6d',
  port: 5432,
});

app.use(express.json());
app.use(cors());

app.get('/tasks', async (req, res) => {
  const result = await pool.query('SELECT * FROM tasks');
  res.json(result.rows);
});

app.post('/tasks', async (req, res) => {
  await pool.query('INSERT INTO tasks (task) VALUES ($1)', [req.body.task]);
  const allTasks = await pool.query('SELECT * FROM tasks');
  res.json(allTasks.rows);
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});