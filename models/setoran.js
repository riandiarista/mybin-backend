const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Setoran = sequelize.define('Setoran', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // Relasi ke tabel Users (Pemilik Setoran)
    user_id: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Nama tabel di database
        key: 'id'
      },
      onDelete: 'CASCADE' 
    },
    tanggal: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('menunggu', 'ditolak', 'selesai'),
      defaultValue: 'menunggu'
    },
    lokasi: {
      type: DataTypes.STRING,
      allowNull: true
    },
    /**
     * PENAMBAHAN KOLOM BARU: total_koin
     * Digunakan untuk menyimpan nominal koin secara permanen (Snapshot).
     * Ini memastikan Admin tetap bisa memverifikasi poin meskipun 
     * data di tabel sampahs sudah di-Hard Delete.
     */
    total_koin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    /**
     * PERUBAHAN KRUSIAL: sampahId
     * 1. allowNull: true agar baris setoran tidak hancur saat sampah dihapus.
     * 2. onDelete: 'SET NULL' agar riwayat tetap ada meski baris sampah asli hilang.
     */
    sampahId: { 
      type: DataTypes.INTEGER,
      allowNull: true, 
      references: {
        model: 'sampahs', // Nama tabel di database
        key: 'id'
      },
      onDelete: 'SET NULL' 
    }
  }, {
    tableName: 'setorans',
    timestamps: true
  });

  return Setoran;
};