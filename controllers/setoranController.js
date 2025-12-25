const { Setoran, Sampah, User, sequelize } = require('../models');

module.exports = {
  // 1. TAMBAH PENYETORAN (Logika Gabungan: Banyak Sampah dalam 1 Setoran)
  createSetoran: async (req, res) => {
    const t = await sequelize.transaction(); 

    try {
      const { sampahIds, lokasi, tanggal } = req.body;
      const userId = req.user.id; 

      if (!sampahIds) {
        return res.status(400).json({ message: 'Daftar ID Sampah tidak boleh kosong' });
      }

      // Memecah string ID menjadi array
      const idArray = sampahIds.split(',').map(id => id.trim());
      let totalKoinKolektif = 0;
      let jumlahSampahBerhasil = 0;

      // Loop untuk menghitung total koin dan menghapus data sampah asli
      for (const sId of idArray) {
        const sampahExists = await Sampah.findByPk(sId);
        
        if (sampahExists) {
          // SNAPSHOT: Akumulasi nilai koin dari semua sampah yang dipilih
          totalKoinKolektif += (parseInt(sampahExists.coin) || 0);

          // HARD DELETE: Menghapus data dari tabel sampahs sesuai logika awal
          await sampahExists.destroy({ transaction: t });
          jumlahSampahBerhasil++;
        }
      }

      if (jumlahSampahBerhasil === 0) {
        await t.rollback();
        return res.status(404).json({ message: 'Tidak ada data sampah valid yang ditemukan' });
      }

      // BUAT HANYA SATU record setoran untuk semua sampah tersebut
      const newSetoran = await Setoran.create({
        user_id: userId,
        sampahId: null, // Di-null karena ini setoran gabungan (sampah asli sudah dihapus)
        total_koin: totalKoinKolektif, // Menyimpan total koin gabungan secara permanen
        lokasi: lokasi,
        tanggal: tanggal || new Date(),
        status: 'menunggu'
      }, { transaction: t });

      await t.commit();

      // PERBAIKAN: Membungkus objek dalam array [ ] agar sinkron dengan model frontend (List<SetoranItem>)
      res.status(201).json({
        message: 'Setoran gabungan berhasil dibuat dan data sampah telah dibersihkan',
        total_data: 1,
        data: [newSetoran] 
      });

    } catch (error) {
      await t.rollback();
      console.error('ERROR CREATE SETORAN:', error);
      res.status(500).json({ message: 'Gagal memproses setoran', error: error.message });
    }
  },

  // 2. LIHAT RIWAYAT (Tetap mengirim total_koin snapshot)
  listSetoran: async (req, res) => {
    try {
      const userId = req.user.id;
      const username = req.user.username; 

      // Filter: superbin (admin) bisa melihat semua, user biasa hanya miliknya sendiri
      const filter = (username === 'superbin') ? {} : { user_id: userId };

      const data = await Setoran.findAll({
        where: filter,
        attributes: ['id', 'user_id', 'sampahId', 'lokasi', 'tanggal', 'status', 'total_koin'],
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

  // 3. UPDATE STATUS (Verifikasi Admin - Menambah Poin ke User)
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params; 
      let { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'Status tidak boleh kosong' });
      }

      status = status.toLowerCase(); 

      const setoran = await Setoran.findByPk(id);

      if (!setoran) {
        return res.status(404).json({ message: 'Data setoran tidak ditemukan' });
      }

      const oldStatus = setoran.status;

      // Jika status diubah ke 'selesai', tambahkan poin ke total_poin_user
      if (status === 'selesai' && oldStatus !== 'selesai') {
        const user = await User.findByPk(setoran.user_id);
        
        if (user) {
          // Mengambil nilai gabungan dari total_koin (Snapshot)
          const koinMasuk = parseFloat(setoran.total_koin) || 0;
          const poinLama = parseFloat(user.total_poin_user) || 0;
          
          await user.update({
            total_poin_user: poinLama + koinMasuk
          });
        }
      }

      await setoran.update({ status: status });

      return res.status(200).json({ 
        message: `Status setoran berhasil diubah menjadi ${status}`,
        status: "success"
      });

    } catch (error) {
      console.error('ERROR UPDATE STATUS:', error);
      res.status(500).json({ message: 'Gagal update status', error: error.message });
    }
  },

  // 4. DELETE SETORAN (Menghapus riwayat setoran)
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