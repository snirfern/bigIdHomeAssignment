import Comment from '../models/Comment';
import {IComment} from "../../domain/entities/IComment";

export class CommentDal {
    async create(newComment: Partial<IComment>): Promise<Comment> {
        return await Comment.create(newComment);
    }

    async findByField(field: string, value: string) {
        return await Comment.findOne({where: {[field]: value}, rejectOnEmpty: false});
    }


}
