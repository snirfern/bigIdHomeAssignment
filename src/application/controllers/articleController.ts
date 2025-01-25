import {NextFunction, Request, Response} from 'express';
import ArticleService from "../../domain/services/articleService";


export class ArticleController {
    private articleService: ArticleService;


    constructor(articleService: ArticleService) {
        this.articleService = articleService;
    }

    async createArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const article = await this.articleService.createArticle(req.body);

            res.status(201).json(article);
        } catch (e) {
            next(e);
        }
    }


    async getArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const article = await this.articleService.findArticle(req.params.id);
            res.status(200).json(article);
        } catch (e) {
            next(e);
        }
    }

    async findWords(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const wordsRes = await this.articleService.findWords(req.query.words as string[]);
            res.status(200).json(wordsRes)
        } catch (e) {
            next(e);
        }
    }

    async findMostCommonWords(req: Request, res: Response, next: NextFunction) {
        try {
            const wordsRes = await this.articleService.findMostCommonWords(req.params.word);
            res.status(200).json(wordsRes)
        } catch (e) {
            next(e);
        }
    }
}
