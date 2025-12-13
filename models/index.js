const sequelize = require('../config/db');

// 1. IMPORT MODEL
// Menggunakan pattern function(sequelize) agar seragam dengan user/bin
const User = require('./user')(sequelize);
const Bin = require('./bin')(sequelize);
const Sampah = require('./sampah')(sequelize);
const Setoran = require('./setoran')(sequelize);

// Import Model Edukasi Baru
const Edukasi = require('./edukasi')(sequelize);

// 2. DEFINISI RELASI (ASSOCIATIONS)

// --- Relasi User & Bin (Lama) ---
User.hasMany(Bin, { foreignKey: 'userId' });
Bin.belongsTo(User, { foreignKey: 'userId' });

// --- Relasi Sampah & Setoran (Lama) ---
Sampah.hasMany(Setoran, { foreignKey: 'sampahId', as: 'setorans', onDelete: 'CASCADE' });
Setoran.belongsTo(Sampah, { foreignKey: 'sampahId', as: 'sampah' });

// --- Relasi User & Edukasi (BARU) ---
// User one-to-many Edukasi
User.hasMany(Edukasi, { foreignKey: 'user_id', as: 'list_edukasi' });
Edukasi.belongsTo(User, { foreignKey: 'user_id', as: 'penulis' });

// 3. EXPORT SEMUA
module.exports = { 
  sequelize, 
  User, 
  Bin, 
  Sampah,
  Setoran, 
  Edukasi // <-- Export tabel baru
};