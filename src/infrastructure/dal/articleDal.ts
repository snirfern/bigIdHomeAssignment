import Article from '../models/Article';
import {IArticle} from "../../domain/entities/IArticle";
import {IBaseDal} from "./interface";


export class ArticleDal implements IBaseDal<Article,IArticle> {
    async create(newArticle: Partial<IArticle>): Promise<Article> {
        return await Article.create(newArticle);
    }

    async findByField(field: string, value: string): Promise<Article | null> {
        return await Article.findOne({where: {[field]: value}, rejectOnEmpty: false});
    }

}
