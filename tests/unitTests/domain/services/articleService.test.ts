import {ArticleRepository} from "../../../../src/infrastructure/repositories/articleRepository";
import ArticleService from "../../../../src/domain/services/articleService";
import {IArticle} from "../../../../src/domain/entities/IArticle";
import {EntityCreationFailure, EntityDoesNotExist} from "../../../../src/domain/errrors/errors";
import {addItemsToSet, getTopKItemsFromSortedSet} from "../../../../src/infrastructure/utils/cacheHelper";
import {extractWordsOffsets} from "../../../../src/infrastructure/utils/utils";

jest.mock('../../../../src/infrastructure/repositories/articleRepository', () => {
    return {
        ArticleRepository: jest.fn().mockImplementation(() => ({
            findById: jest.fn(),
            findByAuthorId: jest.fn(),
            create: jest.fn(),
        })),
    };
});

jest.mock("../../../../src/infrastructure/utils/utils", () => ({
    extractWordsOffsets: jest.fn(),
}));

// Mock the cache helper functions
jest.mock("../../../../src/infrastructure/utils/cacheHelper", () => ({
    addItemsToSet: jest.fn(),
    getTopKItemsFromSortedSet: jest.fn(),
}));

const newArticleMockData: IArticle = {
    authorId: '123',
    title: 'some title',
    content: 'test content',
};

const testWord = 'testWord'
describe('ArticleService', () => {
    let articleService: ArticleService;
    let articleRepositoryMock: jest.Mocked<ArticleRepository>;

    beforeEach(() => {
        articleRepositoryMock = new ArticleRepository() as jest.Mocked<ArticleRepository>;

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
            (addItemsToSet as jest.Mock).mockResolvedValue(1);

            const result = await articleService.createArticle(newArticleMockData);

            expect(articleRepositoryMock.findByAuthorId).toHaveBeenCalledWith(newArticleMockData.authorId);
            expect(articleRepositoryMock.create).toHaveBeenCalledWith(newArticleMockData);
            expect(extractWordsOffsets).toHaveBeenCalledWith(newArticleMockData.content);
            expect(addItemsToSet).toHaveBeenCalledTimes(2);
            expect(addItemsToSet).toHaveBeenCalledWith('test', expect.any(Function), [{
                offsets: [0],
                article_id: '1'
            }]);
            expect(addItemsToSet).toHaveBeenCalledWith('content', expect.any(Function), [{
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

            articleRepositoryMock.findByAuthorId.mockResolvedValue(null);
            articleRepositoryMock.create.mockResolvedValue({id: '1', ...newArticleMockData});
            (extractWordsOffsets as jest.Mock).mockReturnValue({
                test: {offsets: [0], article_id: '1'},
                content: {offsets: [5], article_id: '1'},
            });
            (addItemsToSet as jest.Mock).mockRejectedValue(new Error('Redis error'));

            await expect(articleService.createArticle(newArticleMockData))
                .rejects
                .toThrowError('Internal server error');
        });
    });

    describe('findWords', () => {
        it('should return word offsets correctly from cache helper', async () => {
            (getTopKItemsFromSortedSet as jest.Mock).mockResolvedValue([{article_id: '1', offsets: [0]}]);

            const words = [testWord];
            const result = await articleService.findWords(words);

            expect(getTopKItemsFromSortedSet).toHaveBeenCalledWith(testWord);
            expect(result).toEqual([{[testWord]: [{"article_id": "1", "offsets": [0]}]}]);
        });

        it('should handle cases where no results are found for the words', async () => {
            (getTopKItemsFromSortedSet as jest.Mock).mockResolvedValueOnce([]);

            const result = await articleService.findWords([testWord]);

            expect(getTopKItemsFromSortedSet).toHaveBeenCalledWith(testWord);
            expect(result).toEqual([{[testWord]: []}]);
        });
    });

    describe('findMostCommonWords', () => {
        it('should return the article_id of the most common word', async () => {


            (getTopKItemsFromSortedSet as jest.Mock).mockResolvedValue([
                {article_id: '1', score: 100},
                {article_id: '2', score: 90},
            ]);

            const result = await articleService.findMostCommonWords(testWord);

            expect(getTopKItemsFromSortedSet).toHaveBeenCalledWith(testWord, 1);
            expect(result).toBe('1');
        });

        it('should return undefined if no result is found', async () => {

            (getTopKItemsFromSortedSet as jest.Mock).mockResolvedValue([]);

            const result = await articleService.findMostCommonWords(testWord);

            expect(getTopKItemsFromSortedSet).toHaveBeenCalledWith(testWord, 1);
            expect(result).toEqual('');
        });
    });
});
