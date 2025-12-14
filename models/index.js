// models/index.js

// PERBAIKAN KRUSIAL: Import Sequelize dan DataTypes dari library 'sequelize'
const { Sequelize, DataTypes } = require('sequelize'); 
const sequelize = require('../config/db'); // Ini adalah instance sequelize yang sudah dikonfigurasi

// 1. IMPORT MODEL
// Menggunakan pattern function(sequelize, DataTypes) untuk FIX ERROR
const User = require('./user')(sequelize, DataTypes); // FIX: Teruskan DataTypes
const Bin = require('./bin')(sequelize, DataTypes); // FIX: Teruskan DataTypes
const Sampah = require('./sampah')(sequelize, DataTypes); // FIX: Teruskan DataTypes
const Setoran = require('./setoran')(sequelize, DataTypes); // FIX: Teruskan DataTypes

// Import Model Edukasi Baru
const Edukasi = require('./edukasi')(sequelize, DataTypes); // FIX: Teruskan DataTypes

// --- PENAMBAHAN OLEH Naufal ---
// Import Model Exchange Baru
const Exchange = require('./exchange')(sequelize, DataTypes); // PENAMBAHAN: Model baru
// --- END PENAMBAHAN ---


// 2. DEFINISI RELASI (ASSOCIATIONS)

// --- Relasi User & Setoran (Penting untuk Laporan) ---
User.hasMany(Setoran, { foreignKey: 'user_id', as: 'setoran_user' });
Setoran.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// --- Relasi User & Exchange (PENAMBAHAN OLEH Naufal) ---
User.hasMany(Exchange, { foreignKey: 'user_id', as: 'riwayat_exchange' });
Exchange.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// --- Relasi User & Bin (Lama) ---
User.hasMany(Bin, { foreignKey: 'userId' });
Bin.belongsTo(User, { foreignKey: 'userId' });

// --- Relasi Sampah & Setoran (Lama) ---
Sampah.hasMany(Setoran, { foreignKey: 'sampahId', as: 'setorans', onDelete: 'CASCADE' });
Setoran.belongsTo(Sampah, { foreignKey: 'sampahId', as: 'sampah' });

// --- Relasi User & Edukasi (Lama) ---
User.hasMany(Edukasi, { foreignKey: 'user_id', as: 'list_edukasi' });
Edukasi.belongsTo(User, { foreignKey: 'user_id', as: 'penulis' });


// 3. EXPORT SEMUA
module.exports = { 
  sequelize, 
  User, 
  Bin, 
  Sampah,
  Setoran, 
  Edukasi,
  Exchange // <-- Export tabel baru Anda
};