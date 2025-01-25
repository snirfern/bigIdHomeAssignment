import {NextFunction, Request, Response} from 'express';
import CommentService from "../../domain/services/commentService";

export class CommentController {
    private commentService: CommentService;


    constructor(commentService: CommentService) {
        this.commentService = commentService;
    }

    async createComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const comment = await this.commentService.createComment(req.body);
            res.status(201).json(comment);
        } catch (e) {
            next(e);
        }
    }

    async getComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const comment = await this.commentService.findComment(req.params.id)
            res.status(200).json(comment)
        } catch (e) {
            next(e);
        }
    }


}
