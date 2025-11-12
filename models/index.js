const sequelize = require('../config/db');
const User = require('./user')(sequelize);
const Bin = require('./bin')(sequelize);

User.hasMany(Bin, { foreignKey: 'userId' });
Bin.belongsTo(User, { foreignKey: 'userId' });

module.exports = { sequelize, User, Bin };
