import {RedisClient, RedisConfig, RedisConnectionManager} from "../framework/redis/redis";

export class CacheHelper {
    private redisInstance: RedisClient;

    constructor(config: RedisConfig) {
        this.redisInstance = RedisConnectionManager.getConnection(config)
    }

    async addItemsToSet(key: string, scoreFn: (member?: any) => number, members: any[]): Promise<number> {
        const flattenedMembers: (string | number)[] = [];

        for (const member of members) {
            const score = scoreFn(member);
            const memberString = JSON.stringify(member);
            flattenedMembers.push(score, memberString);
        }

        const addSetItemsRes = await this.redisInstance.addItemsToSortedSet(key, flattenedMembers)
        if (addSetItemsRes === 0) {
            throw new Error('Internal service error')
        }
        return addSetItemsRes;
    }


    async getTopKItemsFromSortedSet<T>(key: string, K?: number): Promise<T[]> {

        const result = await this.redisInstance.getTopkwithScores(key, 0, (K === undefined) ? -1 : K - 1);
        if (!result || result.length === 0) {
            return [];
        }
        const parsedResult: T[] = [];
        for (let i = 0; i < result.length; i += 2) {
            const member = JSON.parse(result[i]);
            parsedResult.push({...member});
        }
        return parsedResult;
    }
}

