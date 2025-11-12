const ApiController = {
    // GET endpoint
    getData: async (req, res) => {
        try {
            // Logic untuk mengambil data
            res.status(200).json({
                status: 'success',
                data: yourData
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // POST endpoint
    postData: async (req, res) => {
        try {
            const data = req.body;
            // Logic untuk menyimpan data
            res.status(201).json({
                status: 'success',
                data: savedData
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};

module.exports = ApiController;