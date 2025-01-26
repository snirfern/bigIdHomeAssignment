import {ArticleRepository} from "../../../../src/infrastructure/repositories/articleRepository";
import ArticleService from "../../../../src/domain/services/articleService";
import {IArticle} from "../../../../src/domain/entities/IArticle";
import {EntityCreationFailure, EntityDoesNotExist} from "../../../../src/domain/errrors/errors";
import {RedisClient, RedisConnectionManager} from "../../../../src/infrastructure/framework/redis/redis";
import {extractWordsOffsets} from "../../../../src/infrastructure/utils/utils";

jest.mock('../../../../src/infrastructure/framework/redis/redis', () => {
    return {
        RedisConnectionManager: {
            getConnection: jest.fn(),
        },
        RedisClient: jest.fn().mockImplementation(() => ({
            getTopScoreItem: jest.fn(),
            addItemsToSet: jest.fn(),
            getTopKItemsFromSortedSet: jest.fn(),
        })),
    };
});

jest.mock('../../../../src/infrastructure/repositories/articleRepository', () => {
    return {
        ArticleRepository: jest.fn().mockImplementation(() => ({
            findById: jest.fn(),
            findByAuthorId: jest.fn(),
            create: jest.fn(),
        })),
    };
});

jest.mock('../../../../src/infrastructure/framework/redis/redis');
jest.mock("../../../../src/infrastructure/utils/utils", () => ({
    extractWordsOffsets: jest.fn(),
}));

const newArticleMockData: IArticle = {
    authorId: '123',
    title: 'some title',
    content: 'test content',
};

const redisMockConfig = {host: 'localhost', port: 123}
describe('ArticleService', () => {
    let articleService: ArticleService;
    let articleRepositoryMock: jest.Mocked<ArticleRepository>;
    let redisClientMock: jest.Mocked<RedisClient>;

    beforeEach(() => {
        articleRepositoryMock = new ArticleRepository() as jest.Mocked<ArticleRepository>;
        redisClientMock = new RedisClient(redisMockConfig) as jest.Mocked<RedisClient>;
        (RedisConnectionManager.getConnection as jest.Mock).mockReturnValue(redisClientMock);

        articleService = new ArticleService(articleRepositoryMock as any);
    });

    describe('findArticle', () => {
        it('should return the article when found', async () => {
            articleRepositoryMock.findById.mockResolvedValue({id: '1', ...newArticleMockData});

            const article = await articleService.findArticle('1');

            expect(articleRepositoryMock.findById).toHaveBeenCalledWith('1');
            expect(article).toEqual({id: '1', ...newArticleMockData});
        });

        it('should throw EntityDoesNotExist if article is not found', async () => {
            articleRepositoryMock.findById.mockResolvedValue(null);

            await expect(articleService.findArticle('8')).rejects.toThrow(EntityDoesNotExist);
        });
    });

    describe('createArticle', () => {
        it('should create an article and add words to Redis', async () => {


            const mockArticle = {id: '1', ...newArticleMockData};
            const mockWordsDict = {
                test: {offsets: [0], article_id: '1'},
                content: {offsets: [5], article_id: '1'},
            };

            articleRepositoryMock.findByAuthorId.mockResolvedValue(null);
            articleRepositoryMock.create.mockResolvedValue(mockArticle);
            (extractWordsOffsets as jest.Mock).mockReturnValue(mockWordsDict);
            (redisClientMock.addItemsToSet as jest.Mock).mockResolvedValue('1');

            const result = await articleService.createArticle(newArticleMockData);

            expect(articleRepositoryMock.findByAuthorId).toHaveBeenCalledWith(newArticleMockData.authorId);
            expect(articleRepositoryMock.create).toHaveBeenCalledWith(newArticleMockData);
            expect(extractWordsOffsets).toHaveBeenCalledWith(newArticleMockData.content);
            expect(redisClientMock.addItemsToSet).toHaveBeenCalledTimes(2);
            expect(redisClientMock.addItemsToSet).toHaveBeenCalledWith('test', expect.any(Function), [{
                offsets: [0],
                article_id: '1'
            }]);
            expect(redisClientMock.addItemsToSet).toHaveBeenCalledWith('content', expect.any(Function), [{
                offsets: [5],
                article_id: '1'
            }]);
            expect(result).toEqual(mockArticle);
        });

        it('should throw EntityCreationFailure if the article creation fails due to validation errors', async () => {


            articleRepositoryMock.findByAuthorId.mockResolvedValue(null);
            articleRepositoryMock.create.mockRejectedValue(new EntityCreationFailure('Entity creation failed.corrupted body data.'));

            await expect(articleService.createArticle(newArticleMockData))
                .rejects
                .toThrowError(EntityCreationFailure);
        });

        it('should throw error if there is a failure in Redis when adding items to set', async () => {

            const newArticleMockData: IArticle = {
                authorId: '123',
                title: 'new article',
                content: 'test content',
            };

            const mockArticle = {id: '1', ...newArticleMockData};
            const mockWordsDict = {
                test: {offsets: [0], article_id: '1'},
                content: {offsets: [5], article_id: '1'},
            };

            articleRepositoryMock.findByAuthorId.mockResolvedValue(null);
            articleRepositoryMock.create.mockResolvedValue(mockArticle);
            (extractWordsOffsets as jest.Mock).mockReturnValue(mockWordsDict);
            (redisClientMock.addItemsToSet as jest.Mock).mockRejectedValue(new Error('Redis error'));

            await expect(articleService.createArticle(newArticleMockData))
                .rejects
                .toThrowError('Redis error');
        });
    });


    describe('findWords', () => {
        it('should return word offsets correctly from Redis', async () => {
            (redisClientMock.getTopScoreItem as jest.Mock).mockResolvedValue({
                test: {offsets: [0], article_id: '1'}
            });

            const words = ['test'];
            const result = await articleService.findWords(words);

            expect(redisClientMock.getTopScoreItem).toHaveBeenCalledWith('test');
            expect(result).toEqual([{test: {offsets: [0], article_id: '1'}}]);
        });

        it('should handle cases where no results are found for the words', async () => {
            const mockRedis = RedisConnectionManager.getConnection(redisMockConfig);
            (mockRedis.getTopScoreItem as jest.Mock).mockResolvedValueOnce(null);

            const words = ['nonexistentWord'];
            const result = await articleService.findWords(words);

            expect(mockRedis.getTopScoreItem).toHaveBeenCalledWith('nonexistentWord');
            expect(result).toEqual([]);
        });
    });
    describe('findMostCommonWords', () => {
        it('should return the article_id of the most common word', async () => {

            const word = 'test';

            (redisClientMock.getTopKItemsFromSortedSet as jest.Mock).mockResolvedValue([
                {article_id: '1', score: 100},
                {article_id: '2', score: 90},
            ]);

            const result = await articleService.findMostCommonWords(word);

            expect(redisClientMock.getTopKItemsFromSortedSet).toHaveBeenCalledWith(word, -1, -1);
            expect(result).toBe('1');
        });

        it('should return undefined if no result is found', async () => {
            const word = 'test';

            (redisClientMock.getTopKItemsFromSortedSet as jest.Mock).mockResolvedValue([]);

            const result = await articleService.findMostCommonWords(word);

            expect(redisClientMock.getTopKItemsFromSortedSet).toHaveBeenCalledWith(word, -1, -1);
            expect(result).toEqual('')
        });
    });
});
