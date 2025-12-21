const { Setoran, Sampah } = require('../models');

module.exports = {
  getLaporanUser: async (req, res) => {
    try {
      const userId = req.user.id;
      const dataLaporan = await Setoran.findAll({
        where: { 
          user_id: userId,
          status: ['selesai', 'ditolak'] 
        },
        include: [{
          model: Sampah,
          as: 'sampah',
          // Pastikan semua kolom yang dibutuhkan Frontend ada di sini
          attributes: ['id', 'jenis', 'berat', 'coin']
        }],
        order: [['createdAt', 'DESC']]
      });

      // Kirim response dalam format List agar cocok dengan ListSampahResponse di Android
      res.json({ 
        message: 'Success', 
        data: dataLaporan 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};