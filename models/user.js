// models/user.js

module.exports = (sequelize, DataTypes) => { // FIX: Pastikan DataTypes diterima di sini
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    
    // --- START PENAMBAHAN OLEH Naufal ---
    total_poin_user: {
        type: DataTypes.DECIMAL(10, 2), // Tipe data untuk akurasi poin
        defaultValue: 0.00,
        allowNull: false
    },
    // --- END PENAMBAHAN OLEH Naufal ---

    // --- TAMBAHAN UNTUK NOTIFIKASI FCM ---
    fcm_token: {
        type: DataTypes.STRING,
        allowNull: true // Diatur true agar tidak error jika token belum tersedia
    }
  });

  return User;
};