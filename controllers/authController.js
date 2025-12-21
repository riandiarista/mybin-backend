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
      
      // Saat register, total_poin_user otomatis 0 (sesuai default value di database)
      const newUser = await User.create({ 
        username, 
        password: hashedPassword,
        total_poin_user: 0 
      });

      res.status(201).json({
        message: 'Registrasi berhasil',
        user: { id: newUser.id, username: newUser.username },
      });
      
      if (next) next(); 
    } catch (error) {
      console.error('🔥 ERROR REGISTER:', error);
      res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
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

      // Bandingkan password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Password salah' });
      }

      // Buat token JWT 
      const token = jwt.sign(
        { id: user.id, username: user.username },
        'secret_key', 
        { expiresIn: '1h', jwtid: uuidv4(), algorithm: 'HS256' }
      );

      // RESPON: Sekarang menyertakan total_poin_user agar saldo muncul otomatis di Android
      res.json({
        message: 'Login berhasil',
        token,
        user: {
          id: user.id,
          username: user.username,
          total_poin_user: user.total_poin_user // <--- PENTING: Untuk menampilkan 27.000 (atau saldo terbaru)
        },
      });

      if (next) next(); 
    } catch (error) {
      console.error('🔥 ERROR LOGIN:', error);
      res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
    }
  },

  // ===============================
  // GET PROFILE (FUNGSI UNTUK SINKRONISASI REAL-TIME)
  // ===============================
  // Digunakan oleh Android (via loadUserBalance) untuk mengambil data dari tabel users
  getProfile: async (req, res) => {
    try {
      // req.user.id didapatkan dari authMiddleware (JWT Decode)
      const userId = req.user.id;
      
      const user = await User.findByPk(userId, {
        attributes: ['id', 'username', 'total_poin_user'] 
      });

      if (!user) {
        return res.status(404).json({ message: 'User tidak ditemukan' });
      }

      res.json({
        message: 'Success',
        data: user // Mengirimkan saldo terbaru dari kolom total_poin_user
      });
    } catch (error) {
      console.error('🔥 ERROR GET PROFILE:', error);
      res.status(500).json({ message: 'Gagal mengambil profil', error: error.message });
    }
  },

  // ===============================
  // UPDATE FCM TOKEN
  // ===============================
  updateFCMToken: async (req, res) => {
    try {
      const { fcm_token } = req.body;
      const userId = req.user.id;

      if (!fcm_token) {
        return res.status(400).json({ message: 'FCM Token wajib disertakan' });
      }

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
      res.status(500).json({ message: 'Terjadi kesalahan server saat update token', error: error.message });
    }
  }
};