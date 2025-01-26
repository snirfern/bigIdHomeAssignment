import {Request, Response} from 'express';
import UserService from "../../../../src/domain/services/userService";
import {UserController} from "../../../../src/application/controllers/userController";

const newUserData = {email: 'testEmail@email.com'};
describe('UserController', () => {
    let userServiceMock: jest.Mocked<UserService>;
    let userController: UserController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
        userServiceMock = {
            createUser: jest.fn(),
            findUser: jest.fn(),
        } as unknown as jest.Mocked<UserService>;

        userController = new UserController(userServiceMock);

        req = {
            body: {},
            params: {},
        };
        res = {
            status: jest.fn().mockReturnThis() as unknown as jest.MockedFunction<Response['status']>,
            json: jest.fn() as unknown as jest.MockedFunction<Response['json']>,
        };
        next = jest.fn();
    });

    describe('createUser', () => {
        it('should create a user and return a 201 status with the user data', async () => {
            req.body = newUserData;

            userServiceMock.createUser.mockResolvedValue(newUserData);

            await userController.createUser(req as Request, res as Response, next);

            expect(userServiceMock.createUser).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newUserData);
        });

        it('should call next with an error if user creation fails', async () => {
            const error = new Error('User creation failed');
            userServiceMock.createUser.mockRejectedValue(error);

            await userController.createUser(req as Request, res as Response, next);

            expect(userServiceMock.createUser).toHaveBeenCalledWith(req.body);
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getUser', () => {
        it('should retrieve a user and return a 200 status with the user data', async () => {
            req.params = newUserData
            userServiceMock.findUser.mockResolvedValue(newUserData);

            await userController.getUser(req as Request, res as Response, next);

            expect(userServiceMock.findUser).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(newUserData);
        });

        it('should call next with an error if user retrieval fails', async () => {
            req.params = {id: '1'};

            const error = new Error('User not found');
            userServiceMock.findUser.mockRejectedValue(error);

            await userController.getUser(req as Request, res as Response, next);

            expect(userServiceMock.findUser).toHaveBeenCalledWith(req.params.id);
            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
