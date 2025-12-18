// controllers/apiController.js
const { Edukasi } = require('../models');

const ApiController = {
    // Fungsi untuk membuat berita edukasi baru
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

            // 3. Validasi input dasar di level controller
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

            res.status(201).json({
                status: 'success',
                message: 'Berita edukasi berhasil diterbitkan!',
                data: savedBerita
            });

        } catch (error) {
            console.error("❌ ERROR POST DATA:", error);

            // PERBAIKAN: Tangkap error validasi Sequelize secara spesifik
            // Ini akan mengirimkan pesan seperti "Format cover tidak valid" ke Android (HTTP 400)
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    status: 'error',
                    message: error.errors.map(e => e.message).join(', ')
                });
            }

            // Jika error lainnya (seperti database mati), kirim HTTP 500
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Fungsi untuk mengambil semua daftar berita
    getData: async (req, res) => {
        try {
            // Aktifkan kembali include: ['penulis'] jika relasi sudah benar di model
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
    }
};

module.exports = ApiController;