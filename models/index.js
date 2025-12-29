

const { Sequelize, DataTypes } = require('sequelize'); 
const sequelize = require('../config/db'); 


const User = require('./user')(sequelize, DataTypes); 
const Bin = require('./bin')(sequelize, DataTypes); 
const Sampah = require('./sampah')(sequelize, DataTypes); 
const Setoran = require('./setoran')(sequelize, DataTypes); 
const Edukasi = require('./edukasi')(sequelize, DataTypes); 
const Exchange = require('./exchange')(sequelize, DataTypes); 





User.hasMany(Setoran, { foreignKey: 'user_id', as: 'setoran_user' });
Setoran.belongsTo(User, { foreignKey: 'user_id', as: 'user' });


User.hasMany(Exchange, { foreignKey: 'user_id', as: 'riwayat_exchange' });
Exchange.belongsTo(User, { foreignKey: 'user_id', as: 'user' });


User.hasMany(Bin, { foreignKey: 'userId' });
Bin.belongsTo(User, { foreignKey: 'userId' });



Sampah.hasMany(Setoran, { foreignKey: 'sampahId', as: 'setorans', onDelete: 'CASCADE' });
Setoran.belongsTo(Sampah, { foreignKey: 'sampahId', as: 'sampah' });


User.hasMany(Edukasi, { foreignKey: 'user_id', as: 'list_edukasi' });
Edukasi.belongsTo(User, { foreignKey: 'user_id', as: 'penulis' });



module.exports = { 
  sequelize, 
  User, 
  Bin, 
  Sampah,
  Setoran, 
  Edukasi,
  Exchange 
};