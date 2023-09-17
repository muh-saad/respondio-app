'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const logger = require('../common/logger')

// connect to mysql
const sequelizeOptions = {
  dialect: 'mysql',
  host: config.host,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  }
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  sequelizeOptions,
);

sequelize
  .authenticate()
  .then(() => {
    logger.info('Successfully established connection to database');
  })
  .catch((err) => {
    logger.error('Unable to connect to database:', err);
  });

module.exports = sequelize;
