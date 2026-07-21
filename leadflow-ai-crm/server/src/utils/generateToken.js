const jwt = require('jsonwebtoken');

const generateToken = (id, role = 'User') => {
  const secret = process.env.JWT_SECRET || 'leadflow_super_secret_jwt_key_2026_production_safe';
  const expiresIn = process.env.JWT_EXPIRE || '30d';

  return jwt.sign({ id, role }, secret, {
    expiresIn,
  });
};

module.exports = generateToken;
