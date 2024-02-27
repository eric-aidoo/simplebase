const libraries = require('../libraries');
libraries.dotenv.config();

const config = {
  appIsInDevMode: process.env.NODE_ENV === 'development' ? true : false,
  productionDb: process.env.PRODUCTION_DATABASE_URL,
  developmentDb: {
    host: process.env.DATABASE_URL,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
};

module.exports = config;
