const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Sampah = sequelize.define('Sampah', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    jenis: { // "jenis sampah"
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "Jenis sampah wajib diisi" } }
    },
    berat: { // "berat sampah"
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: { isFloat: { msg: "Berat harus berupa angka" } }
    },
    detail: { // "detail sampah"
      type: DataTypes.TEXT,
      allowNull: true
    },
    coin: { // "coin/sampah (estimasi)"
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { isInt: { msg: "Coin harus berupa angka bulat" } }
    },
    foto: { // "foto"
      type: DataTypes.STRING,
      allowNull: true
    }
    // createdAt & updatedAt otomatis dibuat oleh Sequelize
  }, {
    tableName: 'sampahs',
    timestamps: true
  });

  return Sampah;
};