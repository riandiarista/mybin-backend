const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Edukasi = sequelize.define('Edukasi', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    judul: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    cover: {
      type: DataTypes.STRING, // Menyimpan path/url gambar
      allowNull: true
    },
    lokasi: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // createdAt dan updatedAt otomatis dibuat oleh Sequelize karena timestamps: true
  }, {
    tableName: 'edukasi', // Nama tabel di database
    timestamps: true
  });

  return Edukasi;
};