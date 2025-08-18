// backend/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = generateToken;
// This function generates a JWT token for the user with a validity of 30 days.
// It uses the user's ID and a secret key stored in environment variables.      