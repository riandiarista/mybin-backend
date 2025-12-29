const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Sampah = sequelize.define('Sampah', {
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
      },
      onDelete: 'CASCADE' 
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
    
    
    
    foto: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    }
  }, {
    tableName: 'sampahs',
    timestamps: true 
  });

  return Sampah;
};