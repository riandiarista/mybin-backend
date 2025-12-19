const { Setoran, Sampah } = require('../models');

module.exports = {
  // 1. TAMBAH PENYETORAN (Proses Checkout dari AddAddressScreen)
  createSetoran: async (req, res) => {
    try {
      // Input dari Frontend: sampahIds (String dipisah koma), totalKoin, lokasi
      const { sampahIds, totalKoin, lokasi, tanggal } = req.body;
      
      // Mengambil userId dari user yang sedang login (via authMiddleware)
      const userId = req.user.id; 

      if (!sampahIds) {
        return res.status(400).json({ message: 'Daftar ID Sampah tidak boleh kosong' });
      }

      // Konversi string "1,2,3" menjadi array [1, 2, 3] agar bisa di-loop
      const idArray = sampahIds.split(',').map(id => id.trim());

      const results = [];

      // Melakukan pemindahan data secara iteratif (looping)
      for (const sId of idArray) {
        // Cek validitas ID Sampah di tabel sampahs
        const sampahExists = await Sampah.findByPk(sId);
        
        if (sampahExists) {
          // Buat baris baru di tabel setorans
          const newSetoran = await Setoran.create({
            user_id: userId,        // Menyambungkan ke ID User
            sampahId: sId,          // Menyambungkan ke ID Sampah
            lokasi: lokasi,         // Alamat dari AddAddressScreen
            tanggal: tanggal || new Date(),
            status: 'menunggu'      // Status awal default
          });

          // Jika Anda ingin menyimpan total koin sebagai catatan di setiap baris setoran, 
          // pastikan kolom 'coin' atau kolom serupa ada di model Setoran Anda.
          
          results.push(newSetoran);
        }
      }

      res.status(201).json({
        message: 'Data sampah berhasil dipindahkan ke tabel setoran',
        jumlah_dipindahkan: results.length,
        data: results
      });

    } catch (error) {
      console.error('ERROR CREATE SETORAN:', error);
      res.status(500).json({ 
        message: 'Gagal memproses setoran', 
        error: error.message 
      });
    }
  },

  // 2. LIHAT RIWAYAT (Menampilkan data dari tabel setorans dan relasi sampahs)
  listSetoran: async (req, res) => {
    try {
      const userId = req.user.id;
      const data = await Setoran.findAll({
        where: { user_id: userId },
        include: [
          {
            model: Sampah,
            as: 'sampah',
            // Mengambil detail dari tabel sampahs untuk ditampilkan di DataSetoranScreen
            attributes: ['jenis', 'berat', 'coin', 'foto'] 
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json({ message: 'Success', data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ... fungsi updateStatus dan deleteSetoran tetap menggunakan logic dasar Sequelize ...
};