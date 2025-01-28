import {CommentRepository} from "../../infrastructure/repositories/commentRepository";
import {IComment} from "../entities/IComment";
import {EntityDoesNotExist} from "../errrors/errors";

class CommentService {
    private commentRepository: CommentRepository;

    constructor(commentRepository: CommentRepository) {
        this.commentRepository = commentRepository;
    }

    async createComment(newComment: IComment): Promise<IComment> {
        return this.commentRepository.create(newComment);
    }

    async findComment(id: string): Promise<IComment> {
        const comment = await this.commentRepository.findById(id);
        if (!comment) {
            throw new EntityDoesNotExist('Comment was not found.');
        }
        return comment;
    }
}

export default CommentService;
