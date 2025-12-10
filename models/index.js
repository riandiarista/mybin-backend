const sequelize = require('../config/db');
const User = require('./user')(sequelize);
const Bin = require('./bin')(sequelize);

// Import models edukasi dari file gabungan
const { MateriEdukasi, FileUpload, Notifikasi, UpdateMateriEdukasi, HapusMateriEdukasi } = require('./news');

// User and Bin relationships
User.hasMany(Bin, { foreignKey: 'userId' });
Bin.belongsTo(User, { foreignKey: 'userId' });

module.exports = { 
  sequelize, 
  User, 
  Bin, 
  MateriEdukasi, 
  FileUpload, 
  Notifikasi, 
  UpdateMateriEdukasi, 
  HapusMateriEdukasi 
};
