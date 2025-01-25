export const sequelizeConfig = {
    username: process.env.DB_USER || 'devuser',
    password: process.env.DB_PASSWORD || 'devpassword',
    database: process.env.DB_NAME || 'devdb',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres'
};

export const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
};