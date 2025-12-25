require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); 
const { sequelize, User } = require('./models');
const errorHandler = require('./middleware/errorMiddleware');

// --- INISIALISASI FIREBASE ADMIN ---
// Digunakan oleh ApiController untuk mengirim notifikasi ke user 'superbin'
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-admin-key.json'); 

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('🔥 Firebase Admin SDK berhasil diinisialisasi.');
}
// ----------------------------------------------

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());

// Limit Payload: Penting untuk upload gambar Base64 dari aplikasi mobile
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes Imports
const authRoutes = require('./routes/auth');
const binsRoutes = require('./routes/bins');
const sampahRoutes = require('./routes/sampah'); 
const apiRoutes = require('./routes/apiRoutes');

// Gunakan prefix /api agar konsisten
app.use('/api', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bins', binsRoutes);
app.use('/api/sampah', sampahRoutes); 
app.use('/api', apiRoutes);

// Error handler middleware (Harus diletakkan setelah rute)
app.use(errorHandler);

/**
 * Fungsi untuk membuat user default (Admin & Superbin)
 * Memastikan akun 'superbin' tersedia sebagai target notifikasi berita
 */
async function createDefaultUsers() {
  try {
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({ username: 'admin', password: hashedPassword });
      console.log('✅ Admin user dibuat: admin / admin123');
    } else {
      console.log('ℹ️  Admin user sudah ada');
    }

    const superbinExists = await User.findOne({ where: { username: 'superbin' } });
    if (!superbinExists) {
      const hashedPassword = await bcrypt.hash('superbin123', 10);
      await User.create({ 
        username: 'superbin', 
        password: hashedPassword,
        fcm_token: null // Akan diupdate saat user superbin login di perangkat
      });
      console.log('✅ Superbin user dibuat: superbin / superbin123');
    } else {
      console.log('ℹ️  Superbin user sudah ada');
    }
  } catch (error) {
    console.error('❌ Gagal membuat user default:', error);
  }
}

// Fungsi untuk menjalankan server
async function startServer() {
  try {
    console.log('🔄 Menghubungkan ke database...');
    await sequelize.authenticate();
    console.log('✅ Database berhasil terhubung.');

    // Sync database: alter: true agar perubahan kolom (seperti fcm_token) diterapkan
    await sequelize.sync({ alter: true }); 
    console.log('🧩 Database telah disinkronisasi.');

    await createDefaultUsers();

    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Gagal memulai server:', error.message || error);
    process.exit(1);
  }
}

startServer();