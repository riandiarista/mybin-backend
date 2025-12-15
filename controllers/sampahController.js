const { Sampah } = require('../models');

module.exports = {
  // 1. GET: Ambil Semua Data Sampah (FIXED: Filter berdasarkan user_id)
  listSampah: async (req, res) => {
    try {
        // FIX 1: Ambil user_id dengan aman dari token
        const user_id = req.user?.id; 
        
        // FIX 2: Validasi Autentikasi: Mengembalikan 401 jika user_id hilang dari token
        if (!user_id) {
            return res.status(401).json({ message: 'Akses ditolak. Token tidak valid atau user ID hilang.' });
        }
        
      // FIX 3: Tambahkan klausa WHERE untuk memfilter berdasarkan user_id
      const data = await Sampah.findAll({
          where: { user_id: user_id }, // Filter: Hanya ambil data milik user ini
        order: [['createdAt', 'DESC']]
      });
      res.json({ message: 'Success', data });
    } catch (error) {
      // Menambahkan logging error untuk debugging server
      console.error('❌ Error saat listSampah:', error.message);
      res.status(500).json({ message: error.message });
    }
  },

  // 2. POST: Tambah Data Sampah (Sudah diperbaiki pada langkah sebelumnya)
  createSampah: async (req, res) => {
    try {
      // Dapatkan user_id dengan aman dari token
      const user_id = req.user?.id; 
      console.log(`User ID yang diterima: ${user_id}`);

      // Validasi Autentikasi
      if (!user_id) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak valid atau user ID hilang.' });
      }
      
      // Ambil input sesuai body request
      const { jenis, berat, detail, coin, foto } = req.body;

      if (!jenis) {
        return res.status(400).json({ message: 'Jenis sampah wajib diisi' });
      }

      // Konversi tipe data secara eksplisit
      const newData = await Sampah.create({
        user_id,
        jenis,
        berat: parseFloat(berat) || 0, // Pastikan dikonversi ke Float
        detail,
        coin: parseInt(coin) || 0,    // Pastikan dikonversi ke Integer
        foto
      });

      res.status(201).json({
        message: 'Data sampah berhasil disimpan',
        data: newData
      });
    } catch (error) {
      // Menambahkan logging error yang lebih detail
      console.error('❌ Error saat createSampah:', error);
      res.status(500).json({ message: 'Gagal menambah data', error: error.message });
    }
  },

  // 3. GET Detail (Tidak Ada Perubahan)
  getSampahById: async (req, res) => {
    try {
      const item = await Sampah.findByPk(req.params.id);
      if (!item) return res.status(404).json({ message: 'Data tidak ditemukan' });
      res.json({ data: item });
    } catch (error) {
      console.error('❌ Error saat getSampahById:', error.message);
      res.status(500).json({ message: error.message });
    }
  },

  // 4. UPDATE (Ditambahkan logging untuk debugging)
  updateSampah: async (req, res) => {
    try {
      const { id } = req.params;
      const { jenis, berat, detail, coin, foto } = req.body;

      // DITAMBAHKAN: Logging untuk debugging
      console.log(`[UPDATE] Mencoba update ID: ${id} oleh User ID: ${req.user?.id}`);

      const item = await Sampah.findByPk(id);
      if (!item) return res.status(404).json({ message: 'Data tidak ditemukan' });

      // [OPSIONAL TAPI DISARANKAN] Tambahkan validasi kepemilikan
      // if (item.user_id !== req.user?.id) return res.status(403).json({ message: 'Akses Ditolak. Anda bukan pemilik data ini.' });

      await item.update({ 
          jenis, 
          berat: parseFloat(berat) || item.berat, // Gunakan nilai lama jika input kosong
          detail, 
          coin: parseInt(coin) || item.coin,    // Gunakan nilai lama jika input kosong
          foto 
      });

      res.json({ message: 'Data berhasil diperbarui', data: item });
    } catch (error) {
      console.error('❌ Error saat updateSampah:', error.message);
      res.status(500).json({ message: error.message });
    }
  },

  // 5. DELETE (Diperbarui: Menambahkan logging untuk debugging)
  deleteSampah: async (req, res) => {
    try {
      // 1. Dapatkan user_id dari token (untuk validasi kepemilikan)
      const user_id = req.user?.id; 

      // DITAMBAHKAN: Logging untuk debugging
      console.log(`[DELETE] Mencoba hapus ID: ${req.params.id} oleh User ID: ${user_id}`);

      // 2. Validasi Autentikasi
      if (!user_id) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak valid atau user ID hilang.' });
      }

      const sampahId = req.params.id;

      // 3. Hapus data berdasarkan ID DAN user_id (Keamanan)
      const deletedRows = await Sampah.destroy({
        where: { 
          id: sampahId,
          user_id: user_id 
        }
      });

      if (deletedRows === 0) {
        // Respon jika ID tidak ditemukan ATAU user bukan pemiliknya
        return res.status(404).json({ 
            message: 'Data sampah tidak ditemukan atau Anda tidak memiliki izin untuk menghapusnya.' 
        });
      }

      res.json({ message: 'Data berhasil dihapus' });
    } catch (error) {
      console.error('❌ Error saat deleteSampah:', error.message);
      res.status(500).json({ message: error.message });
    }
  }
};