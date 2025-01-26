import {ArticleController} from '../controllers/articleController';
import {NextFunction, Request, Response, Router} from 'express';
import ArticleService from "../../domain/services/articleService";
import {ArticleRepository} from "../../infrastructure/repositories/articleRepository";


const articleRouter = Router();
const articleService = new ArticleService(new ArticleRepository());
const articleController = new ArticleController(articleService);

articleRouter.post('/', (req: Request, res: Response, next: NextFunction) => articleController.createArticle(req, res, next));
articleRouter.get('/findWords', (req: Request, res: Response, next: NextFunction) => articleController.findWords(req, res, next));
articleRouter.get('/mostCommonWords/:word', (req: Request, res: Response, next: NextFunction) => articleController.findMostCommonWords(req, res, next));
articleRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => articleController.getArticle(req, res, next));
export default articleRouter;
