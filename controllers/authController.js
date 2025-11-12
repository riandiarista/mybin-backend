const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../models');

module.exports = {
  // ===============================
  // REGISTER USER BARU
  // ===============================
  register: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password wajib diisi' });
      }

      // Cek apakah user sudah ada
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username sudah digunakan' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ username, password: hashedPassword });

      res.status(201).json({
        message: 'Registrasi berhasil',
        user: { id: newUser.id, username: newUser.username },
      });
    } catch (error) {
      console.error('🔥 ERROR REGISTER:', error);
      res.status(500).json({
        message: 'Terjadi kesalahan server',
        error: error.message, // tampilkan pesan error untuk debugging
      });
    }
  },

  // ===============================
  // LOGIN USER
  // ===============================
  login: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password wajib diisi' });
      }

      // Cari user di database
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(404).json({ message: 'User tidak ditemukan' });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Password salah' });
      }

      // Buat token JWT — sertakan jwtid (jti) unik agar token berbeda tiap login
      // jwt.sign akan menambahkan iat otomatis; menambahkan jti memastikan token unik
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET || 'secret_key', // fallback jika JWT_SECRET undefined
        { expiresIn: '1h', jwtid: uuidv4(), algorithm: 'HS256' }
      );

      // Debug log (only for development): tunjukkan jti dan sebagian token
      try {
        const decoded = jwt.decode(token);
        console.log(`🔐 [auth] Login successful for=${user.username} jti=${decoded && decoded.jti ? decoded.jti : 'n/a'}`);
      } catch (e) {
        console.log('🔐 [auth] Login successful (failed to decode token for logging)');
      }

      res.json({
        message: 'Login berhasil',
        token,
        user: {
          id: user.id,
          username: user.username,
        },
      });
    } catch (error) {
      console.error('🔥 ERROR LOGIN:', error);
      res.status(500).json({
        message: 'Terjadi kesalahan server',
        error: error.message,
      });
    }
  },
};
