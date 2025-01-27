export const sequelizeConfig = () => ({
    username: process.env.DB_USER || 'devuser',
    password: process.env.DB_PASSWORD || 'devpassword',
    database: process.env.DB_NAME || 'devdb',
    host: process.env.VE_DB_HOST || process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432
});

export const redisConfig = () => ({
    host: process.env.VE_REDIS_HOST || process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 6379
})