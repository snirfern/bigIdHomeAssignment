import {IArticle} from "../../domain/entities/IArticle";
import {ArticleDal} from "../dal/articleDal";

export class ArticleRepository {
    private articleDal = new ArticleDal();

    async create(newArticle: IArticle): Promise<IArticle> {
        return this.articleDal.create(newArticle);
    }

    async findById(id: string): Promise<IArticle | null> {
        return this.articleDal.findByField('id', id);
    }

    async findByAuthorId(id: string): Promise<IArticle | null> {
        return await this.articleDal.findByField('authorId', id);
    }


}
