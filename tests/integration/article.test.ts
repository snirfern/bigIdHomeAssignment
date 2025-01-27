import request from 'supertest';
import express, {Express} from "express";
import errorHandler from "../../src/application/middleware/errorHandler";
import articleRouter from "../../src/application/routes/articleRouter";

const articleId = '123e4567-e89b-12d3-a456-426614174001'
let app: Express;


beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use('/api/article', articleRouter);
    app.use(errorHandler);
});

describe('Article Integration Tests', () => {

    it('should create a new article', async () => {
        const articleData = {
            title: 'New Article',
            content: 'This is the content of the article cherry banana',
            authorId: '123e4567-e89b-12d3-a456-426614174000'
        };
        const response = await request(app)
            .post('/api/article')
            .send(articleData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(articleData.title);
        expect(response.body.content).toBe(articleData.content);
    });

    it('should get words distribution offsets and article ids', async () => {

        const response = await request(app)
            .get('/api/article/findWords?words=apple&words=bannana&words=cherry')

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);

        const responseObj = response.body[0];
        expect(responseObj).toHaveProperty('cherry');
        expect(responseObj.cherry).toHaveProperty('offsets');
        expect(responseObj.cherry).toHaveProperty('article_id');

        expect(responseObj.cherry.offsets).toEqual([35]);
    });

    it('should find the most common word in articles', async () => {
        const response = await request(app)
            .get(`/api/article/mostCommonWords/cherry`);

        expect(response.status).toBe(200);
        expect(response.body).toBe("f71f5471-c8b9-4615-bc71-6ecc0cb151f1");
    });

    it('should get an article by id', async () => {
        const response = await request(app)
            .get(`/api/article/${articleId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', articleId);
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('content');
    });

    it('should return 404 if article not found', async () => {
        const response = await request(app)
            .get('/api/article/123e4567-e89b-12d3-a456-426614174002');

        expect(response.status).toBe(404);
    });
});
