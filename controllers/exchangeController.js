const { User, Exchange } = require('../models');

const admin = require('firebase-admin'); 

exports.createExchange = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount_poin, phone_number } = req.body;

        
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        
        const currentBalance = parseFloat(user.total_poin_user) || 0;
        const exchangeAmount = parseFloat(amount_poin);

        if (currentBalance < exchangeAmount) {
            return res.status(400).json({ 
                message: "Poin tidak cukup! Saldo Anda saat ini: " + currentBalance.toLocaleString(),
                saldo_saat_ini: currentBalance 
            });
        }

        
        user.total_poin_user = currentBalance - exchangeAmount;
        await user.save();

        
        const newExchange = await Exchange.create({
            user_id: userId,
            amount_poin: exchangeAmount,
            amount_rupiah: exchangeAmount, 
            phone_number: phone_number,
            status: 'Success', 
            exchange_date: new Date()
        });

        
        try {
            
            const adminUser = await User.findOne({ where: { username: 'admin' } });

            if (adminUser && adminUser.fcm_token) {
                const message = {
                    notification: {
                        title: '✅ Exchange Berhasil!', 
                        body: `Pencairan Rp ${exchangeAmount.toLocaleString()} oleh ${user.username} ke nomor ${phone_number} telah sukses.`
                    },
                    
                    data: {
                        click_action: "FLUTTER_NOTIFICATION_CLICK",
                        exchange_id: newExchange.id.toString(),
                        type: "exchange_success" 
                    },
                    token: adminUser.fcm_token
                };

                
                await admin.messaging().send(message);
                console.log('✅ Notifikasi sukses berhasil dikirim ke Admin');
            } else {
                console.log('⚠️ Notifikasi tidak dikirim: User admin atau token FCM tidak ditemukan');
            }
        } catch (fcmError) {
            
            console.error('❌ Gagal mengirim notifikasi FCM:', fcmError);
        }

        
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