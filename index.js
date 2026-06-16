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

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/todoapp');
const taskSchema = new mongoose.Schema({
  task: String
});

const Task = mongoose.model('Task', taskSchema);

app.use(express.json());
app.use(cors());
const { router: authRoutes, verifyToken } = require('./auth');
app.use('/auth', authRoutes);


app.get('/tasks', verifyToken, async (req, res) => {
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
app.get('/mongo-tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});
app.post('/mongo-tasks', async (req, res) => {
    const newTask = new Task({ task: req.body.task });
  await newTask.save();
  const allTasks = await Task.find();
  res.json(allTasks);
});
app.listen(5000, () => {
  console.log('Server running on port 5000');
});