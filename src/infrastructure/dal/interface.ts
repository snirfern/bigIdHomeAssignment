import Article from '../models/Article';
import {IArticle} from "../../domain/entities/IArticle";

export interface IBaseDal {
    create(newArticle: Partial<IArticle>): Promise<Article>;
    findByField(field: string, value: string): Promise<Article | null>;
}
