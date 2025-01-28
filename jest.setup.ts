import sequelizeDB from "./src/infrastructure/framework/db/sequelize";
import logger from "./src/infrastructure/logger/logger"
import {RedisConnectionManager} from "./src/infrastructure/framework/redis/redis";
import config from "./src/config/config";


beforeAll(async () => {
    await RedisConnectionManager.getConnection(config.dataSources.redis.dbConfig).flushAll();
    await sequelizeDB.connect();

    if (process.env.NODE_ENV === 'test') {
        await sequelizeDB.seedDatabase();
    }
    logger.info('Database setup completed successfully before tests.');
});

afterAll(async () => {
    await sequelizeDB.disconnect();
    await RedisConnectionManager.getConnection(config.dataSources.redis.dbConfig).quit();
    logger.info('Test environment cleaned up after all tests.');
});
