import {IArticle} from "../../domain/entities/IArticle";
import {ArticleDal} from "../dal/articleDal";

export class ArticleRepository {
    private articleDal = new ArticleDal();

    async create(newArticle: IArticle): Promise<IArticle> {
        return await this.articleDal.create(newArticle) as IArticle;
    }

    async findById(id: string): Promise<IArticle | null> {
        const article = await this.articleDal.findByField('id', id) as IArticle;
        return article ? article as IArticle : null
    }
    async findByAuthorId(id: string): Promise<IArticle | null> {
        const article = await this.articleDal.findByField('authorId', id) as IArticle;
        return article ? article as IArticle : null
    }


}
