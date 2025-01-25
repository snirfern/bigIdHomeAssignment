import {NextFunction, Request, Response, Router} from 'express';
import {UserController} from '../controllers/userController';
import UserService from "../../domain/services/userService";


const userRouter = Router();

const userService = new UserService()
const userController = new UserController(userService);

userRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => userController.getUser(req, res, next));
userRouter.post('/', (req: Request, res: Response, next: NextFunction) => userController.createUser(req, res, next));

export default userRouter;
