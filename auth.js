const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.json({ message: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.json({ message: 'User registered successfully' });
});
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.json({ message: 'Wrong password' });
  }

  const token = jwt.sign({ username }, 'secretkey');
  res.json({ token });
});


module.exports = router;