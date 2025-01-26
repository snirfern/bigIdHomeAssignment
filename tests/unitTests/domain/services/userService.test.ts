import {IUser} from "../../../../src/domain/entities/IUser";
import {EntityAlreadyExists, EntityDoesNotExist} from "../../../../src/domain/errrors/errors";
import UserService from "../../../../src/domain/services/userService";
import {UserRepository} from "../../../../src/infrastructure/repositories/userRepository";

jest.mock('../../../../src/infrastructure/repositories/userRepository');

const newUserMockData: IUser = {
    email: 'test@example.com'
};

describe('UserService', () => {
    let userService: UserService;
    let userRepositoryMock: jest.Mocked<UserRepository>;

    beforeEach(() => {
        userRepositoryMock = new UserRepository() as jest.Mocked<UserRepository>;
        userService = new UserService(userRepositoryMock);
    });

    describe('createUser', () => {
        it('should create and return the new user when email does not exist', async () => {
            userRepositoryMock.findByEmail.mockResolvedValue(null);
            userRepositoryMock.create.mockResolvedValue({id:'1',...newUserMockData});

            const createdUser = await userService.createUser(newUserMockData);

            expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(newUserMockData.email);
            expect(userRepositoryMock.create).toHaveBeenCalledWith(newUserMockData);
            expect(createdUser).toEqual(({id:'1',...newUserMockData}));
        });

        it('should throw EntityAlreadyExists error if email is already taken', async () => {
            userRepositoryMock.findByEmail.mockResolvedValue(newUserMockData);

            await expect(userService.createUser(newUserMockData)).rejects.toThrow(EntityAlreadyExists);
            await expect(userService.createUser(newUserMockData)).rejects.toThrow('Email already exists.');
        });
    });

    describe('findUser', () => {
        it('should return the user when found', async () => {
            userRepositoryMock.findById.mockResolvedValue({id:'1',...newUserMockData});

            const foundUser = await userService.findUser('1');

            expect(userRepositoryMock.findById).toHaveBeenCalledWith('1');
            expect(foundUser).toEqual({id:'1',...newUserMockData});
        });

        it('should throw EntityDoesNotExist error when user is not found', async () => {
            userRepositoryMock.findById.mockResolvedValue(null);
            await expect(userService.findUser('8')).rejects.toThrow(EntityDoesNotExist);
            await expect(userService.findUser('8')).rejects.toThrow('User not found.');
        });
    });
});
