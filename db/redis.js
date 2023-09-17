const logger = require('../common/logger')
const redis = require('redis');

const redisHost = 'redis', redisPort = 6379;
const client = redis.createClient({ host: redisHost, port: redisPort});

client.on('error', err => logger.error('Redis Client Error:', err));
client.on('ready', () => {
  logger.info('Redis connection successful');
});

class RedisCache {
  static async setWithExpiry(moduleName, key, value) {
    try {
      await client.set(`${moduleName}_${key}`, value, "EX", 120);
      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
  
  static async get(moduleName, key) {
    try {
      return await client.get(`${moduleName}_${key}`);
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
}

module.exports = {
  RedisCache,
  client
};
