const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SECRET_FILE = path.join(__dirname, '..', 'jwt-secret.json');

const getSecret = () => {
  if (fs.existsSync(SECRET_FILE)) {
    const { secret, createdAt } = JSON.parse(fs.readFileSync(SECRET_FILE));
    const ageInDays = (Date.now() - new Date(createdAt)) / (86400000); // ms to days
    if (ageInDays < 3) return secret;
  }

  const newSecret = crypto.randomBytes(64).toString('hex');
  fs.writeFileSync(
    SECRET_FILE,
    JSON.stringify({
      secret: newSecret,
      createdAt: new Date().toISOString(),
    })
  );

  return newSecret;
};

module.exports = getSecret();