import logger from "../logger/logger";

interface WordOffsets {
    offsets: number[];
    article_id?: string;
}

export function extractWordsOffsets(str: string): { [key: string]: WordOffsets } {
    const wordsDict: { [key: string]: WordOffsets } = {};
    let word = '', offset = -1;

    for (let i = 0; i <= str.length; i++) {
        const char = str[i] || ' ';
        if (char === ' ' && word !== '') {
            wordsDict[word] = wordsDict[word] ?? {offsets: []}
            wordsDict[word].offsets.push(offset);
            word = '';
        } else {
            if (word === '') offset = i;
            word += char;
        }
    }

    return wordsDict;
}

export const runWithRetry = async (func: (args?: any) => void, maxRetries: number = 5, retryDelay: number = 5000, ...args: any[]) => {
    let retryCount = 0;
    while (retryCount < maxRetries) {
        try {

            await func(...args)
            logger.info(`${func.name} connected successfully.`);
            return;
        } catch (error) {
            retryCount++;

            if (error instanceof Error) {
                logger.error(`${func.name} connection failed: ${error.message}`);
            } else {
                logger.error(`${func.name} connection failed: Unknown error`);
            }

            if (retryCount < maxRetries) {
                logger.info(`Retrying connection... Attempt ${retryCount}/${maxRetries}`);
                await new Promise((resolve) => setTimeout(resolve, retryDelay));
                retryDelay *= 2;
            } else {
                logger.error(`Maximum retry attempts reached for ${func.name}.`);
            }
        }
    }

}

