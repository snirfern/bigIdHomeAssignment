import {NextFunction, Request, Response, Router} from 'express';
import {CommentController} from '../controllers/commentController';

import CommentService from "../../domain/services/commentService";
import {CommentRepository} from "../../infrastructure/repositories/commentRepository";

const commentRouter = Router();
const commentService = new CommentService(new CommentRepository());
const commentController = new CommentController(commentService);

commentRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => commentController.getComment(req, res, next));
commentRouter.post('/', (req: Request, res: Response, next: NextFunction) => commentController.createComment(req, res, next));


export default commentRouter;
