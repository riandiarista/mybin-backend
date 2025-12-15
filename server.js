require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // jangan lupa require bcrypt
const { sequelize, User } = require('./models');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const binsRoutes = require('./routes/bins');
const sampahRoutes = require('./routes/sampah');

// Gunakan prefix /api agar konsisten
// Mount auth routes under /api so Android client using /api/login will reach the handler
app.use('/api', authRoutes);
// Keep backward-compatible mount so requests to /api/auth/login still work
app.use('/api/auth', authRoutes);
app.use('/api/bins', binsRoutes);
app.use('/api/sampah', sampahRoutes);

// Error handler middleware
app.use(errorHandler);

// Fungsi untuk membuat admin jika belum ada
async function createAdmin() {
  try {
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({ username: 'admin', password: hashedPassword });
      console.log('✅ Admin user dibuat: admin / admin123');
    } else {
      console.log('ℹ️  Admin user sudah ada, skip pembuatan');
    }
  } catch (error) {
    console.error('❌ Gagal membuat admin:', error);
  }
}

// Fungsi untuk menjalankan server
async function startServer() {
  try {
    console.log('🔄 Menghubungkan ke database...');
    await sequelize.authenticate();
    console.log('✅ Database berhasil terhubung.');

    // Sync database (buat tabel jika belum ada)
    await sequelize.sync({ alter: true }); // paksa update tabel jika perlu
    console.log('🧩 Database telah disinkronisasi.');

    // Buat admin otomatis
    await createAdmin();

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
