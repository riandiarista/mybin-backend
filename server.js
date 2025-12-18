require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); 
const { sequelize, User } = require('./models');
const errorHandler = require('./middleware/errorMiddleware');

// --- TAMBAHAN: Inisialisasi Firebase Admin ---
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-admin-key.json'); // Pastikan file ini ada di folder root 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
console.log('🔥 Firebase Admin SDK berhasil diinisialisasi.');
// ----------------------------------------------

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

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
 */
async function createDefaultUsers() {
  try {
    // 1. Buat Admin jika belum ada
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({ username: 'admin', password: hashedPassword });
      console.log('✅ Admin user dibuat: admin / admin123');
    } else {
      console.log('ℹ️  Admin user sudah ada');
    }

    // 2. Buat Superbin jika belum ada
    const superbinExists = await User.findOne({ where: { username: 'superbin' } });
    if (!superbinExists) {
      const hashedPassword = await bcrypt.hash('superbin123', 10);
      await User.create({ 
        username: 'superbin', 
        password: hashedPassword 
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

    // Sync database (buat tabel jika belum ada)
    // Kolom fcm_token akan dibuat otomatis di tabel Users 
    await sequelize.sync({ alter: true }); 
    console.log('🧩 Database telah disinkronisasi.');

    // Menjalankan fungsi pembuatan user default
    await createDefaultUsers();

    // Jalankan server
    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Gagal memulai server:', error.message || error);
    process.exit(1);
  }
}

startServer();