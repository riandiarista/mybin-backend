const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../models');

module.exports = {
  
  
  
  register: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password wajib diisi' });
      }

      
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username sudah digunakan' });
      }

      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      
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

  
  
  
  login: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password wajib diisi' });
      }

      
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(404).json({ message: 'User tidak ditemukan' });
      }

      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Password salah' });
      }

      
      const token = jwt.sign(
        { id: user.id, username: user.username },
        'secret_key', 
        { expiresIn: '1h', jwtid: uuidv4(), algorithm: 'HS256' }
      );

      
      res.json({
        message: 'Login berhasil',
        token,
        user: {
          id: user.id,
          username: user.username,
          total_poin_user: user.total_poin_user 
        },
      });

      if (next) next(); 
    } catch (error) {
      console.error('🔥 ERROR LOGIN:', error);
      res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
    }
  },

  
  
  
  
  getProfile: async (req, res) => {
    try {
      
      const userId = req.user.id;
      
      const user = await User.findByPk(userId, {
        attributes: ['id', 'username', 'total_poin_user'] 
      });

      if (!user) {
        return res.status(404).json({ message: 'User tidak ditemukan' });
      }

      res.json({
        message: 'Success',
        data: user 
      });
    } catch (error) {
      console.error('🔥 ERROR GET PROFILE:', error);
      res.status(500).json({ message: 'Gagal mengambil profil', error: error.message });
    }
  },

  
  
  
  updateFCMToken: async (req, res) => {
    try {
      
      
      const { token } = req.body; 
      const userId = req.user.id;

      
      console.log("-----------------------------------------");
      console.log("📡 REQUEST UPDATE FCM MASUK!");
      console.log("👤 User ID (dari JWT):", userId);
      console.log("🔑 Token yang Diterima:", token);
      console.log("-----------------------------------------");

      if (!token) {
        return res.status(400).json({ message: 'Token wajib disertakan' });
      }

      
      const [updated] = await User.update(
        { fcm_token: token }, 
        { where: { id: userId } }
      );

      if (updated) {
        console.log("✅ DATABASE BERHASIL DIPERBARUI: fcm_token tersimpan.");
        return res.status(200).json({ message: 'FCM Token berhasil diperbarui' });
      }

      console.log("⚠️ DATABASE GAGAL DIPERBARUI: User ID tidak ditemukan.");
      return res.status(404).json({ message: 'User tidak ditemukan' });
    } catch (error) {
      console.error('🔥 ERROR UPDATE FCM TOKEN:', error);
      res.status(500).json({ message: 'Terjadi kesalahan server saat update token', error: error.message });
    }
  }
};