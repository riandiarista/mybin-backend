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
        model: 'users', // Merujuk ke tableName 'users' 
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    judul: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Judul tidak boleh kosong" },
        len: {
          args: [5, 255],
          msg: "Judul harus antara 5 hingga 255 karakter"
        }
      }
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Deskripsi tidak boleh kosong" }
      }
    },
    cover: {
      type: DataTypes.STRING, // Menyimpan path atau URL gambar 
      allowNull: true,
      // PERBAIKAN: Menghapus isUrl sepenuhnya agar bisa menerima URI Android (content://...)
      validate: {
        // Cukup biarkan kosong atau tambahkan validasi lain jika perlu
      }
    },
    lokasi: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'edukasi', // Konsisten dengan skema database 
    timestamps: true      // Mengotomatiskan createdAt dan updatedAt 
  });

  // Definisi Relasi
  Edukasi.associate = (models) => {
    // Menghubungkan Edukasi ke User (Penulis Berita)
    Edukasi.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'penulis' // Alias untuk digunakan saat query (e.g., include: 'penulis')
    });
  };

  return Edukasi;
};