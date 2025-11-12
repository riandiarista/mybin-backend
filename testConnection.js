const sequelize = require('./config/db');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Koneksi ke database mybin berhasil!');
  } catch (error) {
    console.error('❌ Gagal konek ke database:', error);
  }
}

testConnection();
