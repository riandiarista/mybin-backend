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
          
          attributes: ['id', 'jenis', 'berat', 'coin']
        }],
        order: [['createdAt', 'DESC']]
      });

      
      res.json({ 
        message: 'Success', 
        data: dataLaporan 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};