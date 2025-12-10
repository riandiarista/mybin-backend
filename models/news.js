const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// ============================================
// 1. Model: Materi Edukasi
// ============================================
const MateriEdukasi = sequelize.define('materi_edukasi', {
  id_materi: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  judul: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  jenis_materi: {
    type: DataTypes.ENUM('artikel', 'gambar', 'video'),
    allowNull: false,
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tanggal_upload: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'materi_edukasi',
  timestamps: false,
});

// ============================================
// 2. Model: File Upload
// ============================================
const FileUpload = sequelize.define('file_upload', {
  id_upload: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_materi: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'materi_edukasi',
      key: 'id_materi',
    },
  },
  file_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'file_upload',
  timestamps: false,
});

// ============================================
// 3. Model: Notifikasi
// ============================================
const Notifikasi = sequelize.define('notifikasi', {
  id_notifikasi: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tipe_notifikasi: {
    type: DataTypes.ENUM('harian', 'mingguan'),
    allowNull: false,
  },
  konten: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tanggal_kirim: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('terkirim', 'gagal'),
    defaultValue: 'gagal',
  },
}, {
  tableName: 'notifikasi',
  timestamps: false,
});

// ============================================
// 4. Model: Update Materi Edukasi
// ============================================
const UpdateMateriEdukasi = sequelize.define('update_materi_edukasi', {
  id_update: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_materi: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'materi_edukasi',
      key: 'id_materi',
    },
  },
  judul_baru: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deskripsi_baru: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tanggal_update: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'update_materi_edukasi',
  timestamps: false,
});

// ============================================
// 5. Model: Hapus Materi Edukasi
// ============================================
const HapusMateriEdukasi = sequelize.define('hapus_materi_edukasi', {
  id_hapus: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_materi: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'materi_edukasi',
      key: 'id_materi',
    },
  },
  tanggal_hapus: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'hapus_materi_edukasi',
  timestamps: false,
});

// ============================================
// Relasi Antar Tabel
// ============================================

// Relasi MateriEdukasi dengan FileUpload
MateriEdukasi.hasMany(FileUpload, {
  foreignKey: 'id_materi',
  as: 'files',
  onDelete: 'CASCADE',
});
FileUpload.belongsTo(MateriEdukasi, {
  foreignKey: 'id_materi',
});

// Relasi MateriEdukasi dengan UpdateMateriEdukasi
MateriEdukasi.hasMany(UpdateMateriEdukasi, {
  foreignKey: 'id_materi',
  as: 'updates',
  onDelete: 'CASCADE',
});
UpdateMateriEdukasi.belongsTo(MateriEdukasi, {
  foreignKey: 'id_materi',
});

// Relasi MateriEdukasi dengan HapusMateriEdukasi
MateriEdukasi.hasMany(HapusMateriEdukasi, {
  foreignKey: 'id_materi',
  as: 'deletions',
  onDelete: 'CASCADE',
});
HapusMateriEdukasi.belongsTo(MateriEdukasi, {
  foreignKey: 'id_materi',
});

module.exports = {
  MateriEdukasi,
  FileUpload,
  Notifikasi,
  UpdateMateriEdukasi,
  HapusMateriEdukasi,
};
