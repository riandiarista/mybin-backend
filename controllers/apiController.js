// controllers/apiController.js
const { Edukasi, User } = require('../models');
const admin = require('firebase-admin'); // Import firebase-admin untuk mengirim notifikasi

const ApiController = {
    /**
     * Fungsi untuk membuat berita edukasi baru (POST)
     * Dan mengirim notifikasi ke user 'superbin'
     */
    postData: async (req, res) => {
        try {
            // 1. Ambil data dari body request
            const { judul, deskripsi, lokasi, cover } = req.body;

            // 2. Ambil user_id dari req.user (Pastikan authMiddleware bekerja)
            if (!req.user || !req.user.id) {
                return res.status(401).json({
                    status: 'error',
                    message: 'User tidak terautentikasi (Token tidak valid).'
                });
            }
            const userId = req.user.id;

            // 3. Validasi input dasar
            if (!judul || !judul.trim() || !deskripsi || !deskripsi.trim()) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Judul dan Deskripsi tidak boleh kosong.'
                });
            }

            // 4. Simpan ke Database
            const savedBerita = await Edukasi.create({
                user_id: userId,
                judul: judul,
                deskripsi: deskripsi,
                lokasi: lokasi || null,
                cover: cover || null
            });

            // 5. KIRIM NOTIFIKASI KE USER 'superbin'
            try {
                // Cari user dengan username 'superbin' untuk mendapatkan token FCM-nya
                const superbin = await User.findOne({ where: { username: 'superbin' } });

                if (superbin && superbin.fcm_token) {
                    const message = {
                        notification: {
                            title: 'Berita Edukasi Baru! 🌿',
                            body: `Halo Superbin, ada berita baru: "${judul}"`,
                        },
                        token: superbin.fcm_token, // Kirim ke token spesifik milik superbin
                    };

                    // Eksekusi pengiriman via Firebase Admin SDK
                    const response = await admin.messaging().send(message);
                    console.log('✅ Notifikasi berhasil dikirim ke Superbin:', response);
                } else {
                    console.log('⚠️ Notifikasi tidak dikirim: User superbin tidak ditemukan atau fcm_token kosong.');
                }
            } catch (fcmError) {
                // Kita bungkus try-catch agar jika FCM gagal, data berita tetap tersimpan di DB
                console.error("❌ Gagal mengirim notifikasi FCM:", fcmError);
            }

            res.status(201).json({
                status: 'success',
                message: 'Berita edukasi berhasil diterbitkan dan notifikasi dikirim!',
                data: savedBerita
            });

        } catch (error) {
            console.error("❌ ERROR POST DATA:", error);
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    status: 'error',
                    message: error.errors.map(e => e.message).join(', ')
                });
            }
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    /**
     * Fungsi untuk mengambil semua daftar berita (GET)
     */
    getData: async (req, res) => {
        try {
            const listBerita = await Edukasi.findAll({
                order: [['createdAt', 'DESC']]
            });

            res.status(200).json({
                status: 'success',
                data: listBerita
            });

        } catch (error) {
            console.error("❌ ERROR GET DATA:", error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    /**
     * Fungsi untuk memperbarui berita edukasi (PUT)
     */
    updateData: async (req, res) => {
        try {
            const { id } = req.params; 
            const { judul, deskripsi, lokasi, cover } = req.body;

            // 1. Cari berita berdasarkan ID
            const berita = await Edukasi.findByPk(id);
            if (!berita) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Berita tidak ditemukan.'
                });
            }

            // 2. Validasi input
            if (!judul || !judul.trim() || !deskripsi || !deskripsi.trim()) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Judul dan Deskripsi tidak boleh kosong.'
                });
            }

            // 3. Eksekusi Update
            await berita.update({
                judul: judul,
                deskripsi: deskripsi,
                lokasi: lokasi || null,
                cover: cover || null
            });

            res.status(200).json({
                status: 'success',
                message: 'Berita edukasi berhasil diperbarui!',
                data: berita
            });

        } catch (error) {
            console.error("❌ ERROR UPDATE DATA:", error);
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    status: 'error',
                    message: error.errors.map(e => e.message).join(', ')
                });
            }
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    /**
     * Fungsi untuk menghapus berita (DELETE)
     */
    deleteData: async (req, res) => {
        try {
            const { id } = req.params;
            const berita = await Edukasi.findByPk(id);

            if (!berita) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Berita tidak ditemukan.'
                });
            }

            await berita.destroy();

            res.status(200).json({
                status: 'success',
                message: 'Berita berhasil dihapus.'
            });

        } catch (error) {
            console.error("❌ ERROR DELETE DATA:", error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};

module.exports = ApiController;