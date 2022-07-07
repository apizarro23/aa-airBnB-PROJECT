// backend/config/database.js
const config = require('./index');

module.exports = {
  // development: {
  //   storage: config.dbFile,
  //   dialect: "sqlite",
  //   seederStorage: "sequelize",
  //   logQueryParameters: true,
  //   typeValidation: true
  // },
  development: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};