import {UserRepository} from "../../infrastructure/repositories/userRepository";
import {EntityAlreadyExists, EntityDoesNotExist} from "../errrors/errors";
import {IUser} from "../entities/IUser";

class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(newUser: IUser) {

        const existingUser = await this.userRepository.findByEmail(newUser.email);
        if (existingUser) {
            throw new EntityAlreadyExists('Email already exists.');
        }

        return this.userRepository.create(newUser);
    }

    async findUser(id: string) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new EntityDoesNotExist('User not found.');
        }
        return user;
    }
}

export default UserService;
