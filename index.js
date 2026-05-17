const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

let tasks = ['Wake up', 'Study React'];

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const newTask = req.body.task;
  tasks.push(newTask);
  res.json(tasks);
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});