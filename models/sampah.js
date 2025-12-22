const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Sampah = sequelize.define('Sampah', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // Menghubungkan data sampah dengan pemiliknya (User)
    user_id: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Merujuk ke nama tabel Users
        key: 'id'
      },
      onDelete: 'CASCADE' // Jika user dihapus, data sampah miliknya otomatis terhapus
    },
    jenis: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "Jenis sampah wajib diisi" } }
    },
    berat: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: { isFloat: { msg: "Berat harus berupa angka" } }
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    coin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { isInt: { msg: "Coin harus berupa angka bulat" } }
    },
    // Status digunakan untuk validasi apakah koin sudah bisa ditukarkan (Exchange)
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'selesai', 
      validate: {
        notEmpty: { msg: "Status tidak boleh kosong" },
        isIn: {
          args: [['pending', 'selesai', 'ditolak']], 
          msg: "Status harus antara pending, selesai, atau ditolak"
        }
      }
    },
    // PERUBAHAN DI SINI:
    // Menggunakan TEXT('long') agar database sanggup menyimpan string Base64 dari foto
    // yang ukurannya sangat besar (ratusan ribu hingga jutaan karakter).
    foto: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    }
  }, {
    tableName: 'sampahs',
    timestamps: true // Mengaktifkan createdAt & updatedAt otomatis
  });

  return Sampah;
};