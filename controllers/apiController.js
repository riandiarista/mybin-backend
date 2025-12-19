// controllers/apiController.js
const { Edukasi } = require('../models');

const ApiController = {
    /**
     * Fungsi untuk membuat berita edukasi baru (POST)
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

            res.status(201).json({
                status: 'success',
                message: 'Berita edukasi berhasil diterbitkan!',
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