import {RedisClient, RedisConnectionManager} from "../framework/redis/redis";
import config from "../../config/config";


const redisInstance: RedisClient = RedisConnectionManager.getConnection(config.dataSources.redis.dbConfig)
export const addItemsToSet = async (key: string, scoreFn: (member?: any) => number, members: any[]): Promise<number> => {
    const flattenedMembers: (string | number)[] = [];

    for (const member of members) {
        const score = scoreFn(member);
        const memberString = JSON.stringify(member);
        flattenedMembers.push(score, memberString);
    }

    const addSetItemsRes = await redisInstance.addItemsToSortedSet(key, flattenedMembers)
    if (addSetItemsRes === 0) {
        throw new Error('Internal service error')
    }
    return addSetItemsRes;
}

export const getTopKItemsFromSortedSet = async <T>(key: string, K?: number): Promise<T[]> => {

    const result = await redisInstance.getTopkwithScores(key, 0, (K === undefined) ? -1 : K - 1);
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
