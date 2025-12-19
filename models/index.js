// models/index.js

const { Sequelize, DataTypes } = require('sequelize'); 
const sequelize = require('../config/db'); 

// 1. IMPORT MODEL
const User = require('./user')(sequelize, DataTypes); 
const Bin = require('./bin')(sequelize, DataTypes); 
const Sampah = require('./sampah')(sequelize, DataTypes); 
const Setoran = require('./setoran')(sequelize, DataTypes); 
const Edukasi = require('./edukasi')(sequelize, DataTypes); 
const Exchange = require('./exchange')(sequelize, DataTypes); 

// 2. DEFINISI RELASI (ASSOCIATIONS)

// --- Relasi User & Setoran ---
// Menambahkan constraints: false jika perlu untuk mengurangi beban kunci pada database
User.hasMany(Setoran, { foreignKey: 'user_id', as: 'setoran_user' });
Setoran.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// --- Relasi User & Exchange ---
User.hasMany(Exchange, { foreignKey: 'user_id', as: 'riwayat_exchange' });
Exchange.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// --- Relasi User & Bin ---
User.hasMany(Bin, { foreignKey: 'userId' });
Bin.belongsTo(User, { foreignKey: 'userId' });

// --- Relasi Sampah & Setoran ---
// Tetap menggunakan CASCADE untuk kemudahan pengelolaan data sampah
Sampah.hasMany(Setoran, { foreignKey: 'sampahId', as: 'setorans', onDelete: 'CASCADE' });
Setoran.belongsTo(Sampah, { foreignKey: 'sampahId', as: 'sampah' });

// --- Relasi User & Edukasi ---
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
  Exchange 
};