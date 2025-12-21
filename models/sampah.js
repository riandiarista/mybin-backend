const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Sampah = sequelize.define('Sampah', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // START: Penambahan user_id
    user_id: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Merujuk ke nama tabel Users
        key: 'id'
      },
      onDelete: 'CASCADE' // Jika user dihapus, data sampah miliknya juga terhapus
    },
    // END: Penambahan user_id
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
    // PERUBAHAN UTAMA: Penambahan kolom status untuk validasi Exchange
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'selesai', // Status default agar data yang sudah ada bisa ditukarkan
      validate: {
        notEmpty: { msg: "Status tidak boleh kosong" },
        isIn: {
          args: [['pending', 'selesai', 'ditolak']], // Daftar status yang diizinkan
          msg: "Status harus antara pending, selesai, atau ditolak"
        }
      }
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'sampahs',
    timestamps: true // createdAt & updatedAt otomatis dibuat
  });

  return Sampah;
};