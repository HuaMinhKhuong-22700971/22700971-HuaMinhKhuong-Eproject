require('dotenv').config();

module.exports = {
  port: process.env.AUTH_PORT || 3000,
  mongoURI: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN
};
