const { Sampah } = require('../models');

module.exports = {
  
  listSampah: async (req, res) => {
    try {
        
        const user_id = req.user?.id; 
        
        
        if (!user_id) {
            return res.status(401).json({ message: 'Akses ditolak. Token tidak valid atau user ID hilang.' });
        }
        
      
      const data = await Sampah.findAll({
          where: { user_id: user_id }, 
        order: [['createdAt', 'DESC']]
      });
      res.json({ message: 'Success', data });
    } catch (error) {
      
      console.error('❌ Error saat listSampah:', error.message);
      res.status(500).json({ message: error.message });
    }
  },

  
  createSampah: async (req, res) => {
    try {
      
      const user_id = req.user?.id; 
      console.log(`User ID yang diterima: ${user_id}`);

      
      if (!user_id) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak valid atau user ID hilang.' });
      }
      
      
      const { jenis, berat, detail, coin, foto } = req.body;

      if (!jenis) {
        return res.status(400).json({ message: 'Jenis sampah wajib diisi' });
      }

      
      const newData = await Sampah.create({
        user_id,
        jenis,
        berat: parseFloat(berat) || 0, 
        detail,
        coin: parseInt(coin) || 0,    
        foto
      });

      res.status(201).json({
        message: 'Data sampah berhasil disimpan',
        data: newData
      });
    } catch (error) {
      
      console.error('❌ Error saat createSampah:', error);
      res.status(500).json({ message: 'Gagal menambah data', error: error.message });
    }
  },

  
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

  
  updateSampah: async (req, res) => {
    try {
      const { id } = req.params;
      const { jenis, berat, detail, coin, foto } = req.body;

      
      console.log(`[UPDATE] Mencoba update ID: ${id} oleh User ID: ${req.user?.id}`);

      const item = await Sampah.findByPk(id);
      if (!item) return res.status(404).json({ message: 'Data tidak ditemukan' });

      
      

      await item.update({ 
          jenis, 
          berat: parseFloat(berat) || item.berat, 
          detail, 
          coin: parseInt(coin) || item.coin,    
          foto 
      });

      res.json({ message: 'Data berhasil diperbarui', data: item });
    } catch (error) {
      console.error('❌ Error saat updateSampah:', error.message);
      res.status(500).json({ message: error.message });
    }
  },

  
  deleteSampah: async (req, res) => {
    try {
      
      const user_id = req.user?.id; 

      
      console.log(`[DELETE] Mencoba hapus ID: ${req.params.id} oleh User ID: ${user_id}`);

      
      if (!user_id) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak valid atau user ID hilang.' });
      }

      const sampahId = req.params.id;

      
      const deletedRows = await Sampah.destroy({
        where: { 
          id: sampahId,
          user_id: user_id 
        }
      });

      if (deletedRows === 0) {
        
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