import request from 'supertest';
import express, {Express} from "express";
import errorHandler from "../../src/application/middleware/errorHandler";
import commentRouter from "../../src/application/routes/commentRouter";

const commentMockId = '123e4567-e89b-12d3-a456-426614174002'
const articleMockId = '123e4567-e89b-12d3-a456-426614174001'

let app: Express;


beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use('/api/comment', commentRouter);
    app.use(errorHandler);
});

describe('Comment Integration Tests', () => {
    it('should create a new comment', async () => {
        const commentData = {articleId: articleMockId, text: 'Great article!'};
        const response = await request(app)
            .post('/api/comment')
            .send(commentData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.text).toBe(commentData.text);
    });

    it('should get a comment by id', async () => {
        const response = await request(app).get(`/api/comment/${commentMockId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', commentMockId);
        expect(response.body).toHaveProperty('text');
    });

    it('should return 404 if comment not found', async () => {
        const response = await request(app).get('/api/comment/123e4567-e89b-12d3-a456-326614174002');
        expect(response.status).toBe(404);
    });
});
