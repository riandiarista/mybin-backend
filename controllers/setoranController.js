const { Setoran, Sampah, User } = require('../models');

module.exports = {
  // 1. TAMBAH PENYETORAN (Proses Checkout dari AddAddressScreen)
  createSetoran: async (req, res) => {
    try {
      const { sampahIds, lokasi, tanggal } = req.body;
      const userId = req.user.id; 

      if (!sampahIds) {
        return res.status(400).json({ message: 'Daftar ID Sampah tidak boleh kosong' });
      }

      const idArray = sampahIds.split(',').map(id => id.trim());
      const results = [];

      for (const sId of idArray) {
        const sampahExists = await Sampah.findByPk(sId);
        
        if (sampahExists) {
          const newSetoran = await Setoran.create({
            user_id: userId,
            sampahId: sId,
            lokasi: lokasi,
            tanggal: tanggal || new Date(),
            status: 'menunggu' // Status awal saat user menyetor
          });
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
      res.status(500).json({ message: 'Gagal memproses setoran', error: error.message });
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

  // 3. UPDATE STATUS (Logika Krusial Penambahan Poin ke Tabel User)
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params; // ID Setoran
      const { status } = req.body; // Status baru dari Admin (misal: 'selesai')

      // Cari data setoran beserta data koin dari tabel sampah
      const setoran = await Setoran.findByPk(id, {
        include: [{ model: Sampah, as: 'sampah' }]
      });

      if (!setoran) {
        return res.status(404).json({ message: 'Data setoran tidak ditemukan' });
      }

      const oldStatus = setoran.status;

      // LOGIKA UTAMA: Jika status berubah menjadi 'selesai' dan sebelumnya belum selesai
      if (status === 'selesai' && oldStatus !== 'selesai') {
        const user = await User.findByPk(setoran.user_id);
        
        if (user && setoran.sampah) {
          // Ambil koin dari tabel sampah dan tambahkan ke kolom total_poin_user
          const koinMasuk = parseFloat(setoran.sampah.coin) || 0;
          user.total_poin_user = parseFloat(user.total_poin_user) + koinMasuk;
          
          await user.save();
          console.log(`Poin berhasil ditambahkan ke ${user.username}: +${koinMasuk}`);
        }
      }

      // Update status setoran di database
      setoran.status = status;
      await setoran.save();

      res.json({ 
        message: `Status setoran berhasil diubah menjadi ${status}`,
        current_user_poin: status === 'selesai' ? "Updated" : "No Change"
      });

    } catch (error) {
      console.error('ERROR UPDATE STATUS:', error);
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