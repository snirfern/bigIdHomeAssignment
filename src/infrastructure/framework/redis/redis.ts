import Redis, {Redis as RedisInstance} from 'ioredis';
import logger from "../../logger/logger";

interface RedisConfig {
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
        } else {
            logger.info(`Reusing existing Redis connection for ${configKey}`);
        }

        return this.connections.get(configKey)!;
    }


}

class RedisClient {
    private client: RedisInstance;

    constructor(redisConfig: RedisConfig) {
        this.client = new Redis({
            host: redisConfig.host,
            port: redisConfig.port,
        });

        this.client.on('connect', () => {
            logger.info(`Successfully connected to Redis at ${redisConfig.host}:${redisConfig.port}`);
        });

        this.client.on('error', (err) => {
            logger.error(`Redis connection error to ${redisConfig.host}:${redisConfig.port}:\n${err}`);
        });
    }

    async getTopScoreItem(key: string): Promise<{ [key: string]: any } | null> {
        const result = await this.client.zrange(key, -1, -1, 'WITHSCORES');
        if (result.length > 0) {
            const memberString = result[0];
            return {[key]: JSON.parse(memberString)};
        }
        return null;
    }

    async addItemsToSet(key: string, scoreFn: (member?: any) => number, members: any[]): Promise<number> {
        const flattenedMembers: (string | number)[] = [];

        for (const member of members) {
            const score = scoreFn(member);
            const memberString = JSON.stringify(member);
            flattenedMembers.push(score, memberString);
        }

        const addSetItemsRes = await this.client.zadd(key, ...flattenedMembers);
        if (addSetItemsRes === 0) {
            throw new Error('Internal service error')
        }
        return addSetItemsRes;
    }

    async getTopKItemsFromSortedSet(key: string, start: number, end: number): Promise<any[]> {

        const result = await this.client.zrange(key, start, end, 'WITHSCORES');
        if (!result || result.length === 0) {
            return [];
        }
        const parsedResult = [];
        for (let i = 0; i < result.length; i += 2) {
            const member = JSON.parse(result[i]);
            const score = result[i + 1];
            parsedResult.push({...member, score: score});
        }

        return parsedResult;
    }


}

export {RedisClient, RedisConnectionManager};
