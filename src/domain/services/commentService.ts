import {CommentRepository} from "../../infrastructure/repositories/commentRepository";
import {IComment} from "../entities/IComment";
import {EntityDoesNotExist} from "../errrors/errors";

class CommentService {
    private commentRepository: CommentRepository;

    constructor() {
        this.commentRepository = new CommentRepository();
    }

    async createComment(newComment: IComment) {
        return await this.commentRepository.create(newComment);
    }

    async findComment(id: string) {
        const comment = await this.commentRepository.findById(id);
        if (!comment) {
            throw new EntityDoesNotExist('Comment was not found.');
        }
        return comment as IComment;
    }
}

export default CommentService;
