module.exports = (sequelize, DataTypes) => { 
    const Exchange = sequelize.define('Exchange', {
        id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', 
                key: 'id'
            }
        },
        amount_poin: {
            
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        amount_rupiah: { 
            
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        phone_number: { 
            type: DataTypes.STRING,
            allowNull: false,
        },
        exchange_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        status: {
            
            type: DataTypes.ENUM('Pending', 'Berhasil', 'Gagal'), 
            defaultValue: 'Pending', 
            allowNull: false,
        }
    }, {
        freezeTableName: true,
        timestamps: true 
    });

    
    Exchange.associate = (models) => {
        Exchange.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    };

    return Exchange;
};