const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Bin', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING },
  });
};
