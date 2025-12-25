const { User, Exchange } = require('../models');
// Pastikan firebase-admin sudah diinisialisasi di server.js atau file konfigurasi utama
const admin = require('firebase-admin'); 

exports.createExchange = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount_poin, phone_number } = req.body;

        // 1. Ambil data User terbaru
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        // 2. Validasi saldo
        const currentBalance = parseFloat(user.total_poin_user) || 0;
        const exchangeAmount = parseFloat(amount_poin);

        if (currentBalance < exchangeAmount) {
            return res.status(400).json({ 
                message: "Poin tidak cukup! Saldo Anda saat ini: " + currentBalance.toLocaleString(),
                saldo_saat_ini: currentBalance 
            });
        }

        // 3. TRANSACTIONAL UPDATE: Potong saldo user secara real-time
        user.total_poin_user = currentBalance - exchangeAmount;
        await user.save();

        // 4. Simpan rincian transaksi dengan status langsung 'Success'
        const newExchange = await Exchange.create({
            user_id: userId,
            amount_poin: exchangeAmount,
            amount_rupiah: exchangeAmount, // Asumsi 1 poin = 1 rupiah, sesuaikan jika ada rate berbeda
            phone_number: phone_number,
            status: 'Success', // Status diubah menjadi Success agar tidak perlu approval manual
            exchange_date: new Date()
        });

        // --- LANGKAH 4.5: NOTIFIKASI LANGSUNG BERHASIL KE ADMIN ---
        try {
            // Cari user dengan username 'admin' untuk mendapatkan token FCM-nya
            const adminUser = await User.findOne({ where: { username: 'admin' } });

            if (adminUser && adminUser.fcm_token) {
                const message = {
                    notification: {
                        title: '✅ Exchange Berhasil!', // Judul menyatakan sukses
                        body: `Pencairan Rp ${exchangeAmount.toLocaleString()} oleh ${user.username} ke nomor ${phone_number} telah sukses.`
                    },
                    // Data tambahan untuk kebutuhan navigasi di aplikasi Admin
                    data: {
                        click_action: "FLUTTER_NOTIFICATION_CLICK",
                        exchange_id: newExchange.id.toString(),
                        type: "exchange_success" // Tipe diubah menjadi success
                    },
                    token: adminUser.fcm_token
                };

                // Kirim pesan melalui Firebase
                await admin.messaging().send(message);
                console.log('✅ Notifikasi sukses berhasil dikirim ke Admin');
            } else {
                console.log('⚠️ Notifikasi tidak dikirim: User admin atau token FCM tidak ditemukan');
            }
        } catch (fcmError) {
            // Jika FCM gagal, transaksi tetap dianggap sukses di database
            console.error('❌ Gagal mengirim notifikasi FCM:', fcmError);
        }

        // 5. Kirim response balik ke aplikasi User
        res.status(201).json({
            message: "Penukaran berhasil! Saldo Anda telah terpotong dan sedang diproses.",
            status: "success",
            current_balance: user.total_poin_user,
            data: newExchange
        });

    } catch (error) {
        console.error("Exchange Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan server: " + error.message });
    }
};