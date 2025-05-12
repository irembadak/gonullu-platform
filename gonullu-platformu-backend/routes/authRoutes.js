const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Kayıt olma
router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role || 'volunteer'
    });
    await user.save();
    res.status(201).send({ message: 'Kullanıcı oluşturuldu' });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// Giriş yapma
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Email veya şifre hatalı');

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('Email veya şifre hatalı');

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.header('auth-token', token).send({ token, user });
});

module.exports = router;