import {NextFunction, Request, Response} from 'express';
import UserService from "../../domain/services/userService";

export class UserController {
    private userService: UserService;


    constructor(userService: UserService) {
        this.userService = userService
    }

    async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.userService.createUser(req.body);
            res.status(201).json(user);
        } catch (e) {
            next(e);
        }
    }


    async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.userService.findUser(req.params.id);
            res.status(200).json(user);
        } catch (e) {
            next(e);
        }
    }


}
