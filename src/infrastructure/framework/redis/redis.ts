import Redis, {Redis as RedisInstance} from 'ioredis';
import logger from "../../logger/logger";

export interface RedisConfig {
    host: string;
    port: number;
}

class RedisConnectionManager {
    private static connections: Map<string, RedisClient> = new Map();

    static getConnection(redisConfig: RedisConfig): RedisClient {
        const configKey = `${redisConfig.host}:${redisConfig.port}`;
        if (!this.connections.has(configKey)) {
            const redisClient = new RedisClient(redisConfig);
            this.connections.set(configKey, redisClient);
            logger.info(`Created new Redis connection for ${configKey}`);
        }

        return this.connections.get(configKey)!;
    }


}

const WITH_SCORES = 'WITHSCORES'

class RedisClient {
    private client: RedisInstance;

    constructor(redisConfig: RedisConfig) {
        this.client = new Redis({
            host: redisConfig.host,
            port: redisConfig.port,
            lazyConnect: true,
            retryStrategy: () => null
        });

        this.client.on('connect', () => {
            logger.info(`Successfully connected to Redis at ${redisConfig.host}:${redisConfig.port}`);
        });

        this.client.on('error', (err) => {
            logger.error(`error to ${redisConfig.host}:${redisConfig.port}: ${err}`);
        });
    }

    async connect(): Promise<void> {
        await this.client.connect();
        return;
    }

    async flushAll(): Promise<void> {
        await this.client.flushall()
    }

    async quit(): Promise<void> {
        try {
            await this.client.quit();
            logger.info('Redis connection closed successfully');
        } catch (error) {
            logger.error(`Error while closing Redis connection: ${error}`);
        }
    }

    async addItemsToSortedSet(key: string, members: any[]): Promise<number> {
        return this.client.zadd(key, ...members);
    }


    async getTopkwithScores(key: string, start: number, end: number): Promise<any[]> {
        return this.client.zrange(key, start, end, WITH_SCORES);
    }


}

export {RedisClient, RedisConnectionManager};
