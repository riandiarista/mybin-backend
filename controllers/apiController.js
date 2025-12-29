
const { Edukasi, User } = require('../models');
const admin = require('firebase-admin'); 

const ApiController = {
    
    postData: async (req, res) => {
        try {
            
            const { judul, deskripsi, lokasi, cover } = req.body;

            
            if (!req.user || !req.user.id) {
                return res.status(401).json({
                    status: 'error',
                    message: 'User tidak terautentikasi (Token tidak valid).'
                });
            }
            const userId = req.user.id;

            
            if (!judul || !judul.trim() || !deskripsi || !deskripsi.trim()) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Judul dan Deskripsi tidak boleh kosong.'
                });
            }

            
            const savedBerita = await Edukasi.create({
                user_id: userId,
                judul: judul,
                deskripsi: deskripsi,
                lokasi: lokasi || null,
                cover: cover || null
            });

            
            try {
                
                const superbin = await User.findOne({ where: { username: 'superbin' } });

                if (superbin && superbin.fcm_token) {
                    const message = {
                        notification: {
                            title: 'Berita Edukasi Baru! 🌿',
                            body: `Halo Superbin, ada berita baru: "${judul}"`,
                        },
                        token: superbin.fcm_token, 
                    };

                    
                    const response = await admin.messaging().send(message);
                    console.log('✅ Notifikasi berhasil dikirim ke Superbin:', response);
                } else {
                    console.log('⚠️ Notifikasi tidak dikirim: User superbin tidak ditemukan atau fcm_token kosong.');
                }
            } catch (fcmError) {
                
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

    
    updateData: async (req, res) => {
        try {
            const { id } = req.params; 
            const { judul, deskripsi, lokasi, cover } = req.body;

            
            const berita = await Edukasi.findByPk(id);
            if (!berita) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Berita tidak ditemukan.'
                });
            }

            
            if (!judul || !judul.trim() || !deskripsi || !deskripsi.trim()) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Judul dan Deskripsi tidak boleh kosong.'
                });
            }

            
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