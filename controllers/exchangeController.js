const { User, Exchange } = require('../models');

exports.createExchange = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount_poin, phone_number } = req.body;

        // 1. Ambil data User terbaru untuk mendapatkan saldo dari kolom total_poin_user
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        // 2. Validasi saldo: Ambil langsung dari kolom profil
        const currentBalance = parseFloat(user.total_poin_user) || 0;
        const exchangeAmount = parseFloat(amount_poin);

        if (currentBalance < exchangeAmount) {
            return res.status(400).json({ 
                message: "Poin tidak cukup! Saldo Anda saat ini: " + currentBalance.toLocaleString(),
                saldo_saat_ini: currentBalance 
            });
        }

        // 3. TRANSACTIONAL UPDATE: Potong saldo di tabel User
        // Ini memastikan poin berkurang seketika di database
        user.total_poin_user = currentBalance - exchangeAmount;
        await user.save();

        // 4. Simpan rincian transaksi di tabel Exchange
        const newExchange = await Exchange.create({
            user_id: userId,
            amount_poin: exchangeAmount,
            amount_rupiah: exchangeAmount, // Rasio 1:1 Galaloc.std
            phone_number: phone_number,
            status: 'Pending',
            exchange_date: new Date()
        });

        // 5. Kirim response balik ke Android dengan saldo bersih terbaru
        res.status(201).json({
            message: "Penukaran berhasil! Poin Anda telah terpotong secara real-time.",
            status: "success",
            current_balance: user.total_poin_user,
            data: newExchange
        });

    } catch (error) {
        console.error("Exchange Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan server: " + error.message });
    }
};