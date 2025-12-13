const { Setoran, Sampah } = require('../models');

module.exports = {
  // 1. TAMBAH PENYETORAN (Pickup Request)
  createSetoran: async (req, res) => {
    try {
      // Input: sampahId (wajib), lokasi, tanggal (opsional, default NOW)
      const { sampahId, lokasi, tanggal } = req.body;

      // Validasi: Pastikan Sampah ID ada di database
      const sampahExists = await Sampah.findByPk(sampahId);
      if (!sampahExists) {
        return res.status(404).json({ message: 'ID Sampah tidak valid/ditemukan' });
      }

      const newSetoran = await Setoran.create({
        sampahId,
        lokasi,
        tanggal: tanggal || new Date(), // Gunakan input user atau waktu sekarang
        status: 'menunggu'
      });

      res.status(201).json({
        message: 'Permintaan penyetoran berhasil dibuat',
        data: newSetoran
      });
    } catch (error) {
      res.status(500).json({ message: 'Gagal membuat setoran', error: error.message });
    }
  },

  // 2. LIHAT RIWAYAT (Include detail sampah: berat, foto, coin)
  listSetoran: async (req, res) => {
    try {
      const data = await Setoran.findAll({
        include: [
          {
            model: Sampah,
            as: 'sampah',
            // Kita bisa ambil info spesifik dari tabel sampah
            attributes: ['jenis', 'berat', 'coin', 'foto', 'detail'] 
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json({ message: 'Success', data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 3. UPDATE STATUS (Misal: Driver menjemput)
  updateStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const item = await Setoran.findByPk(req.params.id);
      
      if (!item) return res.status(404).json({ message: 'Data tidak ditemukan' });

      await item.update({ status });
      res.json({ message: 'Status berhasil diperbarui', data: item });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 4. DELETE
  deleteSetoran: async (req, res) => {
    try {
      const item = await Setoran.findByPk(req.params.id);
      if (!item) return res.status(404).json({ message: 'Data tidak ditemukan' });
      await item.destroy();
      res.json({ message: 'Data berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};