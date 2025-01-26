import {IComment} from "../../../../src/domain/entities/IComment";
import {EntityDoesNotExist} from "../../../../src/domain/errrors/errors";
import CommentService from "../../../../src/domain/services/commentService";
import {CommentRepository} from "../../../../src/infrastructure/repositories/commentRepository";

jest.mock('../../../../src/infrastructure/repositories/commentRepository');

const newCommentMockData: IComment = {
    articleId: '1',
    text: 'some text'
};

describe('CommentService', () => {
    let commentService: CommentService;
    let commentRepositoryMock: jest.Mocked<CommentRepository>;

    beforeEach(() => {
        commentRepositoryMock = new CommentRepository() as jest.Mocked<CommentRepository>;
        commentService = new CommentService(commentRepositoryMock);
    });

    describe('createComment', () => {
        it('should create and return the new comment', async () => {
            commentRepositoryMock.create.mockResolvedValue({id: '1', ...newCommentMockData});

            const createdComment = await commentService.createComment(newCommentMockData);

            expect(commentRepositoryMock.create).toHaveBeenCalledWith(newCommentMockData);
            expect(createdComment).toEqual({id: '1', ...newCommentMockData});
        });

        it('should throw error when creation fails', async () => {
            commentRepositoryMock.create.mockRejectedValue(new Error('Creation failed'));

            await expect(commentService.createComment(newCommentMockData)).rejects.toThrow('Creation failed');
        });
    });

    describe('findComment', () => {
        it('should return the comment when found', async () => {
            commentRepositoryMock.findById.mockResolvedValue(newCommentMockData);

            const foundComment = await commentService.findComment('1');

            expect(commentRepositoryMock.findById).toHaveBeenCalledWith('1');
            expect(foundComment).toEqual(newCommentMockData);
        });

        it('should throw EntityDoesNotExist error when comment is not found', async () => {
            commentRepositoryMock.findById.mockResolvedValue(null);

            await expect(commentService.findComment('8')).rejects.toThrow(EntityDoesNotExist);
            await expect(commentService.findComment('8')).rejects.toThrow('Comment was not found.');
        });
    });
});
