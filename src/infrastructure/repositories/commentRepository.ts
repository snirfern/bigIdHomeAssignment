import {IComment} from "../../domain/entities/IComment";
import {CommentDal} from "../dal/commentDal";

export class CommentRepository {
    private commentDal = new CommentDal();

    async create(newComment: IComment): Promise<IComment> {
        return this.commentDal.create(newComment)
    }

    async findById(id: string): Promise<IComment | null> {
        return this.commentDal.findByField('id', id);
    }

}
