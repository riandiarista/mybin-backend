module.exports = {
  listBins: async (req, res) => {
    // TODO: fetch bins from DB
    res.json([]);
  },

  createBin: async (req, res) => {
    // TODO: create new bin
    res.status(201).json({});
  },
};
