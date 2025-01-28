import Comment from '../models/Comment';
import {IComment} from "../../domain/entities/IComment";
import {IBaseDal} from "./interface";

export class CommentDal implements IBaseDal<Comment, IComment> {
    async create(newComment: Partial<IComment>): Promise<Comment> {
        return Comment.create(newComment);
    }

    async findByField(field: string, value: string): Promise<Comment | null> {
        return Comment.findOne({where: {[field]: value}, rejectOnEmpty: false});
    }


}
