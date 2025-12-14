// controllers/laporanController.js
// Asumsi model diimpor dari index.js
const { Setoran, Sampah, Exchange, User } = require('../models'); 

// FUNGSI 1: Mengambil Saldo Poin Pengguna
const getSaldoPoin = async (req, res) => {
    try {
        // Asumsi 'req.user.id' didapat dari auth middleware
        const userId = req.user.id; 
        const user = await User.findByPk(userId, {
            attributes: ['total_poin_user'] // Hanya ambil field yang dibutuhkan
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
        }

        return res.json({ 
            success: true, 
            saldo: user.total_poin_user,
            saldo_rupiah: user.total_poin_user // Konversi 1:1 untuk frontend
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal mengambil saldo poin.' });
    }
};

// FUNGSI 2: Mengambil Riwayat Setoran Sampah (Kredit Poin)
const getRiwayatSetoran = async (req, res) => {
    try {
        const userId = req.user.id; 

        // Mengambil data setoran beserta data jenis Sampah
        const setoran = await Setoran.findAll({
            where: { user_id: userId },
            include: [{
                model: Sampah,
                as: 'sampah',
                attributes: ['jenis_sampah', 'poin_reward'] // Ambil data reward untuk detail
            }],
            order: [['tanggal_setoran', 'DESC']]
        });

        return res.json({ success: true, data: setoran });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal mengambil riwayat setoran.' });
    }
};

// FUNGSI 3: Mengambil Riwayat Penukaran Poin (Debet Poin)
const getRiwayatExchange = async (req, res) => {
    try {
        const userId = req.user.id; 

        const exchange = await Exchange.findAll({
            where: { user_id: userId },
            order: [['exchange_date', 'DESC']]
        });

        return res.json({ success: true, data: exchange });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal mengambil riwayat penukaran.' });
    }
};

module.exports = {
    getSaldoPoin,
    getRiwayatSetoran,
    getRiwayatExchange,
};