const { isDbConnected } = require('../config/db');

module.exports = (req, res, next) => {
  if (isDbConnected && isDbConnected()) return next();
  return res.status(503).json({
    error: 'Service unavailable - database not connected',
    detail: 'The API cannot reach the database (network unreachable). Check server logs for ENETUNREACH or migrate the DB to an IPv4-accessible provider.'
  });
};
