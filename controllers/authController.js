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
        // Memastikan tidak ada request yang menggantung
        next(); 
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

      // Buat token JWT 
      const token = jwt.sign(
        { id: user.id, username: user.username },
        'secret_key', // <--- FIX: HANYA GUNAKAN HARDCODED SECRET KEY INI
        { expiresIn: '1h', jwtid: uuidv4(), algorithm: 'HS256' }
      );

      // Debug log (hanya untuk development)
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
        // Memastikan tidak ada request yang menggantung
        next(); 
    } catch (error) {
      console.error('🔥 ERROR LOGIN:', error);
      res.status(500).json({
        message: 'Terjadi kesalahan server',
        error: error.message,
      });
    }
  },

  // ===============================
  // UPDATE FCM TOKEN (TAMBAHAN)
  // ===============================
  updateFCMToken: async (req, res) => {
    try {
      const { fcm_token } = req.body;
      const userId = req.user.id; // Diambil dari token yang sudah didekode oleh authMiddleware

      if (!fcm_token) {
        return res.status(400).json({ message: 'FCM Token wajib disertakan' });
      }

      // Update kolom fcm_token pada user yang sedang login
      const [updated] = await User.update(
        { fcm_token },
        { where: { id: userId } }
      );

      if (updated) {
        return res.status(200).json({ message: 'FCM Token berhasil diperbarui' });
      }

      return res.status(404).json({ message: 'User tidak ditemukan' });
    } catch (error) {
      console.error('🔥 ERROR UPDATE FCM TOKEN:', error);
      res.status(500).json({
        message: 'Terjadi kesalahan server saat update token',
        error: error.message,
      });
    }
  }
};