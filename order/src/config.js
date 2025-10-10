require('dotenv').config();

module.exports = {
  port: process.env.ORDER_PORT || 3002,
  mongoURI: process.env.MONGO_URL
};
