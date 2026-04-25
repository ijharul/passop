const { getSha1Hash } = require("../utils/cryptoUtils");

const checkPasswordBreach = async (password) => {
  const hash = getSha1Hash(password);
  const prefix = hash.substring(0, 5);
  const suffix = hash.substring(5);

  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const data = await response.text();

  const lines = data.split('\n');
  const match = lines.find(line => line.trim().startsWith(suffix));

  if (match) {
    const count = match.split(':')[1];
    return { breached: true, count: parseInt(count) };
  }

  return { breached: false };
};

module.exports = { checkPasswordBreach };
