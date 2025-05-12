const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Kayıt fonksiyonu
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      email,
      password: hashedPassword,
      name
    });

    await user.save();
    res.status(201).json({ message: "Kullanıcı oluşturuldu" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Giriş fonksiyonu
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).json({ error: "Geçersiz şifre" });

  // JWT token oluştur
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.header('Authorization', token).json({ token });
};