const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Setoran = sequelize.define('Setoran', {
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
    
    total_koin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },

    
    
   
    detail_jenis: {
      type: DataTypes.STRING,
      allowNull: true
    },
    
    detail_berat: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
   
    detail_foto: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },

    
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