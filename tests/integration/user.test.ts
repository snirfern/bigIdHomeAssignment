import request from 'supertest';
import express, {Express} from "express";
import userRouter from "../../src/application/routes/usersRouter";
import errorHandler from "../../src/application/middleware/errorHandler";

let app: Express;
const userMockId = '123e4567-e89b-12d3-a456-426614174000'


beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use('/api/user', userRouter);
    app.use(errorHandler);
})
describe('User Integration Tests', () => {

    it('should create a new user', async () => {
        const userData = {email: 'testuser@test.com'};
        const response = await request(app)
            .post('/api/user')
            .send(userData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.email).toBe(userData.email);
    });

    it('should get a user by id', async () => {
        const response = await request(app)
            .get(`/api/user/${userMockId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', userMockId);
        expect(response.body).toHaveProperty('email');
    });


    it('should return 404 when user does not exist', async () => {
        const response = await request(app)
            .get('/api/users/9999');

        expect(response.status).toBe(404);
    });
});
