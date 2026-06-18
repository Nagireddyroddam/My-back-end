const express = require('express');
const app = express();
const cors = require('cors');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

app.use(express.json());
app.use(cors());

const { router: authRoutes, verifyToken } = require('./auth');
app.use('/auth', authRoutes);

app.get('/tasks',  async (req, res) => {
  const result = await pool.query('SELECT * FROM tasks');
  res.json(result.rows);
});

app.post('/tasks', async (req, res) => {
  await pool.query('INSERT INTO tasks (task) VALUES ($1)', [req.body.task]);
  const allTasks = await pool.query('SELECT * FROM tasks');
  res.json(allTasks.rows);
});

app.delete('/tasks/:id', async (req, res) => {
  const id = req.params.id;
  await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  const allTasks = await pool.query('SELECT * FROM tasks');
  res.json(allTasks.rows);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});