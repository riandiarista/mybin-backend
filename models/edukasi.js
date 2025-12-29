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
      type: DataTypes.STRING, 
      allowNull: true,
      
      validate: {
        
      }
    },
    lokasi: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'edukasi', 
    timestamps: true      
  });

  
  Edukasi.associate = (models) => {
    
    Edukasi.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'penulis' 
    });
  };

  return Edukasi;
};