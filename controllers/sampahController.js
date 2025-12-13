const { Sampah } = require('../models');

module.exports = {
  // 1. GET: Ambil Semua Data Sampah
  listSampah: async (req, res) => {
    try {
      const data = await Sampah.findAll({
        order: [['createdAt', 'DESC']]
      });
      res.json({ message: 'Success', data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 2. POST: Tambah Data Sampah (Sesuai kolom baru)
  createSampah: async (req, res) => {
    try {
      // Ambil input sesuai ralat database
      const { jenis, berat, detail, coin, foto } = req.body;

      if (!jenis) {
        return res.status(400).json({ message: 'Jenis sampah wajib diisi' });
      }

      const newData = await Sampah.create({
        jenis,
        berat: berat || 0,
        detail,
        coin: coin || 0,
        foto
      });

      res.status(201).json({
        message: 'Data sampah berhasil disimpan',
        data: newData
      });
    } catch (error) {
      res.status(500).json({ message: 'Gagal menambah data', error: error.message });
    }
  },

  // 3. GET Detail
  getSampahById: async (req, res) => {
    try {
      const item = await Sampah.findByPk(req.params.id);
      if (!item) return res.status(404).json({ message: 'Data tidak ditemukan' });
      res.json({ data: item });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 4. UPDATE
  updateSampah: async (req, res) => {
    try {
      const { id } = req.params;
      const { jenis, berat, detail, coin, foto } = req.body;
      
      const item = await Sampah.findByPk(id);
      if (!item) return res.status(404).json({ message: 'Data tidak ditemukan' });

      await item.update({ jenis, berat, detail, coin, foto });

      res.json({ message: 'Data berhasil diperbarui', data: item });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 5. DELETE
  deleteSampah: async (req, res) => {
    try {
      const item = await Sampah.findByPk(req.params.id);
      if (!item) return res.status(404).json({ message: 'Data tidak ditemukan' });
      await item.destroy();
      res.json({ message: 'Data berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};