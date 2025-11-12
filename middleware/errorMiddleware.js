module.exports = (err, req, res, next) => {
  // Basic error handler
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
};
