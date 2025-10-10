require('dotenv').config();

module.exports = {
  port: process.env.PRODUCT_PORT || 3001,
  mongoURI: process.env.MONGO_URL
};
