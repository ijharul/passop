const bcrypt = require('bcrypt');
const crypto = require('crypto');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const getSha1Hash = (data) => {
  return crypto.createHash('sha1').update(data).digest('hex').toUpperCase();
};

module.exports = {
  hashPassword,
  comparePassword,
  getSha1Hash
};
