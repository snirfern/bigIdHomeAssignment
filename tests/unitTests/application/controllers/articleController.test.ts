import {Request, Response} from 'express';
import {ArticleController} from "../../../../src/application/controllers/articleController";
import ArticleService from "../../../../src/domain/services/articleService";

interface IWord {
    offsets: number[];
    article_id: string;
}

interface WordOffsetsMap {
    [word: string]: IWord[];
}

const newArticleData = {authorId: '1', title: 'Test Article', content: 'Test content'};
const wordQuery = ['test', 'content'];
const commonWord = 'test';

describe('ArticleController', () => {
    let articleServiceMock: jest.Mocked<ArticleService>;
    let articleController: ArticleController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
        articleServiceMock = {
            createArticle: jest.fn(),
            findArticle: jest.fn(),
            findWords: jest.fn(),
            findMostCommonWords: jest.fn(),
        } as unknown as jest.Mocked<ArticleService>;

        articleController = new ArticleController(articleServiceMock);

        req = {
            body: {},
            params: {},
            query: {},
        };
        res = {
            status: jest.fn().mockReturnThis() as unknown as jest.MockedFunction<Response['status']>,
            json: jest.fn() as unknown as jest.MockedFunction<Response['json']>,
        };
        next = jest.fn();
    });

    describe('createArticle', () => {
        it('should create an article and return a 201 status with the article data', async () => {
            req.body = newArticleData;

            articleServiceMock.createArticle.mockResolvedValue(newArticleData);

            await articleController.createArticle(req as Request, res as Response, next);

            expect(articleServiceMock.createArticle).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newArticleData);
        });

        it('should call next with an error if article creation fails', async () => {
            const error = new Error('Article creation failed');
            articleServiceMock.createArticle.mockRejectedValue(error);

            await articleController.createArticle(req as Request, res as Response, next);

            expect(articleServiceMock.createArticle).toHaveBeenCalledWith(req.body);
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getArticle', () => {
        it('should retrieve an article and return a 200 status with the article data', async () => {
            req.params = {id: '1'};
            articleServiceMock.findArticle.mockResolvedValue(newArticleData);

            await articleController.getArticle(req as Request, res as Response, next);

            expect(articleServiceMock.findArticle).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(newArticleData);
        });

        it('should call next with an error if article retrieval fails', async () => {
            req.params = {id: '1'};

            const error = new Error('Article not found');
            articleServiceMock.findArticle.mockRejectedValue(error);

            await articleController.getArticle(req as Request, res as Response, next);

            expect(articleServiceMock.findArticle).toHaveBeenCalledWith(req.params.id);
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('findWords', () => {
        it('should find words and return a 200 status with the words result', async () => {
            req.query = {words: wordQuery};
            const mockWordsResult: WordOffsetsMap[] = [
                {"banana": [{offsets: [8], article_id: "ff801138-1d87-48ea-afdd-4ae3a82cc71a"}]},
                {"cherry": [{offsets: [18], article_id: "ff801138-1d87-48ea-afdd-4ae3a82cc71a"}]}
            ];
            articleServiceMock.findWords.mockResolvedValue(mockWordsResult);
            await articleController.findWords(req as Request, res as Response, next);
            expect(articleServiceMock.findWords).toHaveBeenCalledWith(wordQuery);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockWordsResult);
        });

        it('should call next with an error if finding words fails', async () => {
            req.query = {words: wordQuery};
            const error = new Error('Words not found');
            articleServiceMock.findWords.mockRejectedValue(error);
            await articleController.findWords(req as Request, res as Response, next);
            expect(articleServiceMock.findWords).toHaveBeenCalledWith(wordQuery);
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('findMostCommonWords', () => {
        it('should find the most common words and return a 200 status with the result', async () => {
            req.params = {word: commonWord};

            const mockCommonWordsResult = '123';
            articleServiceMock.findMostCommonWords.mockResolvedValue(mockCommonWordsResult);

            await articleController.findMostCommonWords(req as Request, res as Response, next);

            expect(articleServiceMock.findMostCommonWords).toHaveBeenCalledWith(commonWord);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockCommonWordsResult);
        });

        it('should call next with an error if finding most common words fails', async () => {
            req.params = {word: commonWord};

            const error = new Error('Error finding common words');
            articleServiceMock.findMostCommonWords.mockRejectedValue(error);

            await articleController.findMostCommonWords(req as Request, res as Response, next);

            expect(articleServiceMock.findMostCommonWords).toHaveBeenCalledWith(commonWord);
            expect(next).toHaveBeenCalledWith(error);
        });
    });

});
