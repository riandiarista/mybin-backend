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
                model: 'Users', // Pastikan nama tabel user Anda benar
                key: 'id'
            }
        },
        amount_poin: {
            // Menggunakan INTEGER karena poin biasanya tidak memiliki desimal
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        amount_rupiah: { 
            // Menggunakan INTEGER karena perbandingan 1:1 (Rp 1.000, dst)
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        phone_number: { // PERUBAHAN: Pengganti bank_detail
            type: DataTypes.STRING,
            allowNull: false,
        },
        exchange_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        status: {
            // Menambahkan 'Pending' agar ada proses verifikasi admin
            type: DataTypes.ENUM('Pending', 'Berhasil', 'Gagal'), 
            defaultValue: 'Pending', 
            allowNull: false,
        }
    }, {
        freezeTableName: true,
        timestamps: true // Sangat disarankan untuk audit data di Galaloc.std
    });

    // Menambahkan relasi agar bisa di-join dengan tabel User
    Exchange.associate = (models) => {
        Exchange.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    };

    return Exchange;
};