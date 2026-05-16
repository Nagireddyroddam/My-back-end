const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from my first server!');
});

app.get('/about', (req, res) => {
  res.send('This is the about page');
});

app.get('/contact', (req, res) => {
  res.send('This is the contact page');
});

app.post('/tasks', (req, res) => {
  const task = req.body.task;
  res.send('Task received: ' + task);
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});