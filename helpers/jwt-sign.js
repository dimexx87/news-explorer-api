const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');

const jwtSign = (id) => jwt.sign(
  {
    id,
  },
  JWT_SECRET,
  { expiresIn: '7d' },
);

module.exports = jwtSign;
