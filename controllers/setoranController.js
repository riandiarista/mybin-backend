const { Setoran, Sampah, User } = require('../models');

module.exports = {
  // 1. TAMBAH PENYETORAN
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
            status: 'menunggu'
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

  // 2. LIHAT RIWAYAT
  listSetoran: async (req, res) => {
    try {
      const userId = req.user.id;
      const username = req.user.username; 

      const filter = (username === 'superbin') ? {} : { user_id: userId };

      const data = await Setoran.findAll({
        where: filter,
        include: [
          {
            model: Sampah,
            as: 'sampah',
            attributes: ['jenis', 'berat', 'coin', 'foto'] 
          },
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

  // 3. UPDATE STATUS (LOGIKA UTAMA VERIFIKASI)
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params; 
      let { status } = req.body;

      // Log untuk pengecekan di terminal Node.js
      console.log(`[Galaloc.std Log] Mencoba update Setoran ID: ${id} ke Status: ${status}`);

      if (!status) {
        return res.status(400).json({ message: 'Status tidak boleh kosong' });
      }

      status = status.toLowerCase(); // Pastikan 'selesai' atau 'ditolak'

      // Cari setoran berdasarkan ID
      const setoran = await Setoran.findByPk(id, {
        include: [{ model: Sampah, as: 'sampah' }]
      });

      if (!setoran) {
        console.log(`[Galaloc.std Log] Setoran ID ${id} tidak ditemukan di database.`);
        return res.status(404).json({ message: 'Data setoran tidak ditemukan' });
      }

      const oldStatus = setoran.status;

      // LOGIKA POIN: Hanya jika status berubah menjadi 'selesai'
      if (status === 'selesai' && oldStatus !== 'selesai') {
        const user = await User.findByPk(setoran.user_id);
        
        if (user && setoran.sampah) {
          const koinMasuk = parseFloat(setoran.sampah.coin) || 0;
          const poinLama = parseFloat(user.total_poin_user) || 0;
          
          // Proses update poin di tabel User
          await user.update({
            total_poin_user: poinLama + koinMasuk
          });
          
          console.log(`[Galaloc.std Log] Poin ditambahkan ke ${user.username}: +${koinMasuk}`);
        }
      }

      // Update status di tabel Setoran
      await setoran.update({ status: status });

      console.log(`[Galaloc.std Log] Status Setoran ID ${id} berhasil diubah menjadi ${status}`);

      return res.status(200).json({ 
        message: `Status setoran berhasil diubah menjadi ${status}`,
        status: "success"
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