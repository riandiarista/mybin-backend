const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Setoran = sequelize.define('Setoran', {
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
      onDelete: 'CASCADE' // Opsional: Jika user dihapus, setoran yang dia buat juga dihapus
    },
    // END: Penambahan user_id
    tanggal: { // "Tanggal"
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    status: { // "Status"
      type: DataTypes.ENUM('menunggu', 'dijemput', 'selesai'),
      defaultValue: 'menunggu'
    },
    lokasi: { // "Lokasi"
      type: DataTypes.STRING,
      allowNull: true
    },
    sampahId: { // "sampah_id" (FK ke tabel Sampahs)
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sampahs',
        key: 'id'
      },
      onDelete: 'CASCADE' // Jika data sampah dihapus, setoran ikut terhapus
    }
    // createdAt & updatedAt otomatis dibuat oleh Sequelize
  }, {
    tableName: 'setorans',
    timestamps: true
  });

  return Setoran;
};