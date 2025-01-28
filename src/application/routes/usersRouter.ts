import {NextFunction, Request, Response, Router} from 'express';
import {UserController} from '../controllers/userController';
import UserService from "../../domain/services/userService";
import {UserRepository} from "../../infrastructure/repositories/userRepository";


const userRouter = Router();

const userService = new UserService(new UserRepository())
const userController = new UserController(userService);

userRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => userController.getUser(req, res, next));
userRouter.post('/', (req: Request, res: Response, next: NextFunction) => userController.createUser(req, res, next));

export default userRouter;

