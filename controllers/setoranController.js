const { Setoran, Sampah, User, sequelize } = require('../models');

module.exports = {
  // 1. TAMBAH PENYETORAN (Logika Hard Delete & Snapshot Koin Permanen)
  createSetoran: async (req, res) => {
    const t = await sequelize.transaction(); 

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
          // SNAPSHOT: Ambil nilai koin sebelum data sampah dihapus
          const koinSnapshot = sampahExists.coin || 0;

          // Buat record baru di tabel setorans
          const newSetoran = await Setoran.create({
            user_id: userId,
            sampahId: sId,
            total_koin: koinSnapshot, // Menyimpan koin secara permanen di kolom baru
            lokasi: lokasi,
            tanggal: tanggal || new Date(),
            status: 'menunggu'
          }, { transaction: t });

          // HARD DELETE: Menghapus data dari tabel sampahs
          await sampahExists.destroy({ transaction: t });

          results.push(newSetoran);
        }
      }

      await t.commit();

      res.status(201).json({
        message: 'Setoran berhasil dibuat dan data sampah telah dibersihkan',
        jumlah_dipindahkan: results.length,
        data: results
      });

    } catch (error) {
      await t.rollback();
      console.error('ERROR CREATE SETORAN:', error);
      res.status(500).json({ message: 'Gagal memproses setoran', error: error.message });
    }
  },

  // 2. LIHAT RIWAYAT (DIPERBAIKI AGAR MENGIRIM total_koin)
  listSetoran: async (req, res) => {
    try {
      const userId = req.user.id;
      const username = req.user.username; 

      const filter = (username === 'superbin') ? {} : { user_id: userId };

      const data = await Setoran.findAll({
        where: filter,
        attributes: ['id', 'user_id', 'sampahId', 'lokasi', 'tanggal', 'status', 'total_koin'], // Pastikan total_koin ikut dikirim
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

  // 3. UPDATE STATUS (LOGIKA VERIFIKASI ADMIN - POIN AMAN)
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

      // LOGIKA POIN: Menggunakan kolom total_koin ( Snapshot )
      if (status === 'selesai' && oldStatus !== 'selesai') {
        const user = await User.findByPk(setoran.user_id);
        
        if (user) {
          // Mengambil dari snapshot koin yang kita simpan saat create
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