import {Request, Response} from 'express';
import {CommentController} from "../../../../src/application/controllers/commentController";
import CommentService from "../../../../src/domain/services/commentService";

const newCommentData = {articleId: '1', text: 'This is a comment'};

describe('CommentController', () => {
    let commentServiceMock: jest.Mocked<CommentService>;
    let commentController: CommentController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
        commentServiceMock = {
            createComment: jest.fn(),
            findComment: jest.fn(),
        } as unknown as jest.Mocked<CommentService>;

        commentController = new CommentController(commentServiceMock);

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

    describe('createComment', () => {
        it('should create a comment and return a 201 status with the comment data', async () => {
            req.body = newCommentData;

            commentServiceMock.createComment.mockResolvedValue(newCommentData);

            await commentController.createComment(req as Request, res as Response, next);

            expect(commentServiceMock.createComment).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newCommentData);
        });

        it('should call next with an error if comment creation fails', async () => {
            const error = new Error('Comment creation failed');
            commentServiceMock.createComment.mockRejectedValue(error);

            await commentController.createComment(req as Request, res as Response, next);

            expect(commentServiceMock.createComment).toHaveBeenCalledWith(req.body);
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getComment', () => {
        it('should retrieve a comment and return a 200 status with the comment data', async () => {
            req.params = {id: '1'};
            commentServiceMock.findComment.mockResolvedValue(newCommentData);

            await commentController.getComment(req as Request, res as Response, next);

            expect(commentServiceMock.findComment).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(newCommentData);
        });

        it('should call next with an error if comment retrieval fails', async () => {
            req.params = {id: '2'};

            const error = new Error('Comment not found');
            commentServiceMock.findComment.mockRejectedValue(error);

            await commentController.getComment(req as Request, res as Response, next);

            expect(commentServiceMock.findComment).toHaveBeenCalledWith(req.params.id);
            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
