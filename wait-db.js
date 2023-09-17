const { Sequelize } = require('sequelize');
const { client } = require('./db/redis')
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/config.json')[env];

async function waitDb() {
  try {
    const sequelize = new Sequelize({
      dialect: config.dialect,
      host: config.host,
      username: config.username,
      password: config.password,
      database: config.database,
    });
    
    await sequelize.authenticate();
    
    // Close the database connection
    await  sequelize.close();
    
    console.log('Database connections has been established successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    setTimeout(waitDb, 2000); // Retry every 2 seconds
  }
}

waitDb();
