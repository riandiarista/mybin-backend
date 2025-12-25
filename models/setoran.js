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
     * Snapshot koin: Menyimpan nominal koin secara permanen.
     */
    total_koin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },

    // --- PENAMBAHAN KOLOM SNAPSHOT DETAIL (PINDAHAN DARI TABEL SAMPAH) ---
    
    /**
     * detail_jenis: Menyimpan gabungan nama jenis sampah (contoh: "Plastik, Kertas").
     */
    detail_jenis: {
      type: DataTypes.STRING,
      allowNull: true
    },
    /**
     * detail_berat: Menyimpan akumulasi berat sampah yang disetorkan.
     */
    detail_berat: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    /**
     * detail_foto: Menyimpan string gambar Base64 secara permanen.
     * Menggunakan TEXT('long') agar mampu menampung ukuran data gambar yang besar.
     */
    detail_foto: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },

    /**
     * sampahId tetap dipertahankan untuk kompatibilitas sistem lama.
     * Dibuat allowNull: true agar baris setoran tidak hancur saat sampah asli dihapus.
     */
    sampahId: { 
      type: DataTypes.INTEGER,
      allowNull: true, 
      references: {
        model: 'sampahs', 
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