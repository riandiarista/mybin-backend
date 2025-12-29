

module.exports = (sequelize, DataTypes) => { 
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    
    
    total_poin_user: {
        type: DataTypes.DECIMAL(10, 2), 
        defaultValue: 0.00,
        allowNull: false
    },
    

    
    fcm_token: {
        type: DataTypes.STRING,
        allowNull: true 
    }
  });

  return User;
};