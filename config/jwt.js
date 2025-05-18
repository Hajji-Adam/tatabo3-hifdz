// config/jwt.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SECRET_FILE = path.join(__dirname, '..', 'jwt-secret.json');

const getSecret = () => {
  if (fs.existsSync(SECRET_FILE)) {
    try {
      const data = fs.readFileSync(SECRET_FILE, 'utf8');
      const { secret, createdAt } = JSON.parse(data);

      const ageInDays = (Date.now() - new Date(createdAt)) / (86400000); // ms to days
      if (ageInDays < 3) return secret;
    } catch (e) {
      console.warn('Invalid JWT secret file, regenerating...');
    }
  }

  const newSecret = crypto.randomBytes(64).toString('hex');
  const now = new Date().toISOString();

  fs.writeFileSync(
    SECRET_FILE,
    JSON.stringify({ secret: newSecret, createdAt: now }, null, 2)
  );

  return newSecret;
};

module.exports = { secret: getSecret() };