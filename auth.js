const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const existing = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  if (existing.rows.length > 0) {
    return res.json({ message: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
  res.json({ message: 'User registered successfully' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  if (result.rows.length === 0) {
    return res.json({ message: 'User not found' });
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.json({ message: 'Wrong password' });
  }

  const token = jwt.sign({ username }, 'secretkey');
  res.json({ token });
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.json({ message: 'No token provided' });
  }
  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      return res.json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { router, verifyToken };