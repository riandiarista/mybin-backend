// models/exchange.js

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
        },
        amount_poin: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        amount_rupiah: { 
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        bank_detail: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        exchange_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('Berhasil', 'Gagal'), 
            defaultValue: 'Berhasil', 
            allowNull: false,
        }
    }, {
        freezeTableName: true
    });
    return Exchange;
};