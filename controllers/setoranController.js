const { Setoran, Sampah, User, sequelize } = require('../models');
const admin = require('firebase-admin'); // Pastikan Firebase sudah diinisialisasi di server.js

module.exports = {
    // 1. TAMBAH PENYETORAN (Snapshot Detail, Hard Delete, & Notifikasi ke Superbin)
    createSetoran: async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const { sampahIds, lokasi, tanggal } = req.body;
            const userId = req.user.id;
            const currentUsername = req.user.username; // Mengambil username pengirim

            if (!sampahIds) {
                return res.status(400).json({ message: 'Daftar ID Sampah tidak boleh kosong' });
            }

            const idArray = sampahIds.split(',').map(id => id.trim());
            let totalKoinKolektif = 0;
            let snapshotJenis = [];
            let snapshotBerat = 0;
            let snapshotFoto = null;
            let jumlahSampahBerhasil = 0;

            // Proses pemindahan data dari tabel Sampah ke snapshot Setoran
            for (const sId of idArray) {
                const sampahExists = await Sampah.findByPk(sId);
                
                if (sampahExists) {
                    totalKoinKolektif += (parseInt(sampahExists.coin) || 0);
                    snapshotJenis.push(sampahExists.jenis);
                    snapshotBerat += parseFloat(sampahExists.berat || 0);
                    
                    // Ambil foto pertama sebagai perwakilan cover setoran
                    if (!snapshotFoto) snapshotFoto = sampahExists.foto;

                    // HARD DELETE: Menghapus data asli agar "Sampahku" bersih
                    await sampahExists.destroy({ transaction: t });
                    jumlahSampahBerhasil++;
                }
            }

            if (jumlahSampahBerhasil === 0) {
                await t.rollback();
                return res.status(404).json({ message: 'Tidak ada data sampah valid' });
            }

            // Simpan data setoran ke database
            const newSetoran = await Setoran.create({
                user_id: userId,
                sampahId: null,
                total_koin: totalKoinKolektif,
                lokasi: lokasi,
                tanggal: tanggal || new Date(),
                status: 'menunggu',
                detail_jenis: snapshotJenis.join(', '),
                detail_berat: snapshotBerat,
                detail_foto: snapshotFoto
            }, { transaction: t });

            await t.commit();

            // --- PROSES NOTIFIKASI FCM KE SUPERBIN ---
            try {
                // Cari user superbin untuk mendapatkan token FCM-nya
                const superbin = await User.findOne({ where: { username: 'superbin' } });
                
                if (superbin && superbin.fcm_token) {
                    const message = {
                        notification: {
                            title: '🔔 Setoran Sampah Baru!',
                            body: `User ${currentUsername} baru saja menyetor di ${lokasi}. Segera cek!`
                        },
                        token: superbin.fcm_token
                    };

                    await admin.messaging().send(message);
                    console.log('✅ Notifikasi berhasil dikirim ke superbin');
                }
            } catch (fcmError) {
                console.error('❌ Gagal mengirim notifikasi FCM ke superbin:', fcmError.message);
            }

            res.status(201).json({
                message: 'Setoran berhasil dibuat dan notifikasi dikirim',
                total_data: 1,
                data: [newSetoran] 
            });

        } catch (error) {
            if (t) await t.rollback();
            res.status(500).json({ message: 'Gagal memproses setoran', error: error.message });
        }
    },

    // 2. LIHAT RIWAYAT (Admin 'superbin' melihat semua, User melihat miliknya sendiri)
    listSetoran: async (req, res) => {
        try {
            const userId = req.user.id;
            const username = req.user.username; 

            const filter = (username === 'superbin') ? {} : { user_id: userId };

            const data = await Setoran.findAll({
                where: filter,
                include: [
                    {
                        model: User,
                        as: 'user', 
                        attributes: ['username']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.json({ message: 'Success', data });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // 3. UPDATE STATUS (Verifikasi oleh Admin & Kirim Notifikasi Balik ke User)
    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            let { status } = req.body;

            if (!status) return res.status(400).json({ message: 'Status wajib diisi' });

            status = status.toLowerCase(); 
            
            // PERUBAHAN: Sertakan model User (dengan fcm_token) pemilik setoran
            const setoran = await Setoran.findByPk(id, {
                include: [{ 
                    model: User, 
                    as: 'user', 
                    attributes: ['id', 'fcm_token', 'total_poin_user'] 
                }]
            });

            if (!setoran) return res.status(404).json({ message: 'Data tidak ditemukan' });

            const oldStatus = setoran.status;
            const targetUser = setoran.user;

            // Jika status berubah menjadi 'selesai', tambahkan poin ke saldo user
            if (status === 'selesai' && oldStatus !== 'selesai') {
                if (targetUser) {
                    const koinMasuk = parseFloat(setoran.total_koin) || 0;
                    const poinLama = parseFloat(targetUser.total_poin_user) || 0;
                    await targetUser.update({ total_poin_user: poinLama + koinMasuk });
                }
            }

            // Update status di database
            await setoran.update({ status: status });

            // --- PROSES NOTIFIKASI BALIK KE USER PEMILIK SETORAN ---
            if (targetUser && targetUser.fcm_token) {
                try {
                    let notifTitle = '';
                    let notifBody = '';

                    if (status === 'selesai') {
                        notifTitle = '✅ Setoran Terverifikasi!';
                        notifBody = `Setoran Anda telah diterima. Selamat! +${setoran.total_koin} koin telah ditambahkan ke saldo Anda.`;
                    } else if (status === 'tolak') {
                        notifTitle = '❌ Setoran Ditolak';
                        notifBody = `Mohon maaf, setoran Anda di ${setoran.lokasi} tidak dapat kami verifikasi.`;
                    }

                    if (notifTitle) {
                        const message = {
                            notification: {
                                title: notifTitle,
                                body: notifBody
                            },
                            token: targetUser.fcm_token
                        };
                        await admin.messaging().send(message);
                        console.log(`✅ Notifikasi [${status}] terkirim ke user ID: ${targetUser.id}`);
                    }
                } catch (fcmError) {
                    console.error('❌ Gagal mengirim notifikasi balik ke user:', fcmError.message);
                }
            }

            res.status(200).json({ message: 'Status berhasil diperbarui', status: "success" });
        } catch (error) {
            res.status(500).json({ message: 'Gagal update status', error: error.message });
        }
    },

    // 4. DELETE SETORAN
    deleteSetoran: async (req, res) => {
        try {
            const { id } = req.params;
            const setoran = await Setoran.findByPk(id);
            if (!setoran) return res.status(404).json({ message: 'Data tidak ditemukan' });

            await setoran.destroy();
            res.json({ message: 'Setoran berhasil dihapus' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};