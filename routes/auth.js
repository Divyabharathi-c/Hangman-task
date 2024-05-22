// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/User.js');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).send('User registered');
  } catch (err) {
    res.status(400).send('Error registering user');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret');
    res.json({ token });
  } catch (err) {
    res.status(400).send('Error logging in');
  }
});

module.exports = router;
