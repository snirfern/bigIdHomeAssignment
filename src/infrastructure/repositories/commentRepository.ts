import {IComment} from "../../domain/entities/IComment";
import {CommentDal} from "../dal/commentDal";

export class CommentRepository {
    private commentDal = new CommentDal();

    async create(newComment: IComment): Promise<IComment> {
        return await this.commentDal.create(newComment) as IComment
    }

    async findById(id: string): Promise<IComment | null> {
        const comment = await this.commentDal.findByField('id',id)
        return comment ? comment as IComment : null;
    }

}
