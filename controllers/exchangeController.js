// controllers/exchangeController.js
const { Exchange, User } = require('../models');
// Asumsi Sequelize diimpor di file models/index.js
const sequelize = require('sequelize'); 

const exchangePoin = async (req, res) => {
    // Input dari Frontend
    const { amount_poin, bank_detail } = req.body; 
    const userId = req.user.id; 

    // Validasi dasar
    if (!amount_poin || !bank_detail || amount_poin <= 0) {
        return res.status(400).json({ success: false, message: 'Input jumlah poin dan detail bank tidak valid.' });
    }

    // Menggunakan Transaction untuk integritas data
    const t = await Exchange.sequelize.transaction(); // Inisialisasi transaksi

    try {
        const user = await User.findByPk(userId, { transaction: t });

        if (!user) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
        }

        // 1. Validasi Saldo
        if (user.total_poin_user < amount_poin) {
            await t.rollback();
            return res.status(400).json({ success: false, message: 'Saldo poin tidak mencukupi.' });
        }

        // 2. Debet Saldo (Pengurangan Poin)
        user.total_poin_user = user.total_poin_user - amount_poin; // Lakukan pengurangan
        await user.save({ transaction: t });

        // 3. Catat Transaksi Penukaran
        await Exchange.create({
            user_id: userId,
            amount_poin: amount_poin,
            amount_rupiah: amount_poin, 
            bank_detail: bank_detail,
            status: 'Berhasil' // Langsung Berhasil (Simulasi)
        }, { transaction: t });

        await t.commit(); // Commit perubahan ke database

        res.status(200).json({ 
            success: true, 
            message: `Penukaran ${amount_poin} poin berhasil! Sisa poin Anda: ${user.total_poin_user}.`,
            sisa_poin: user.total_poin_user
        });

    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ success: false, message: 'Penukaran poin gagal karena kesalahan server.' });
    }
};

module.exports = {
    exchangePoin
};