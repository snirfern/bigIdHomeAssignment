import {ArticleRepository} from "../../infrastructure/repositories/articleRepository";
import {AppError, EntityCreationFailure, EntityDoesNotExist} from "../errrors/errors";
import {IArticle} from "../entities/IArticle";
import {extractWordsOffsets} from "../../infrastructure/utils/utils";
import {ValidationError} from 'sequelize';
import logger from "../../infrastructure/logger/logger";
import {addItemsToSet, getTopKItemsFromSortedSet} from "../../infrastructure/utils/cacheHelper";
import {UserRepository} from "../../infrastructure/repositories/userRepository";

interface IWord {
    offsets: number[];
    article_id: string;
}

interface WordOffsetsMap {
    [key: string]: IWord[];
}


class ArticleService {
    private articleRepository: ArticleRepository;
    private userRepository: UserRepository;

    constructor(articleRepository: ArticleRepository, userRepository: UserRepository) {
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
    }

    async createArticle(newArticleData: IArticle): Promise<IArticle> {
        try {

            const doesAuthorExists = await this.userRepository.findById(newArticleData.authorId);
            if (!doesAuthorExists)
                throw new EntityDoesNotExist('Author does not exists.');
            const newArticle = await this.articleRepository.create(newArticleData);
            const wordsDict = extractWordsOffsets(newArticle.content);
            for (const word of Object.keys(wordsDict)) {
                wordsDict[word].article_id = newArticle.id;
                await addItemsToSet(word, () => wordsDict[word].offsets.length ?? 0, [wordsDict[word]]);
            }

            return newArticle;

        } catch (error) {
            logger.error(`Article service error:\n${(error as Error).message}`)
            if (error instanceof ValidationError) {
                throw new EntityCreationFailure('Entity creation failed. corrupted body data.');
            } else if (error instanceof EntityDoesNotExist) {
                throw error;
            } else {
                throw new AppError('Internal server error')
            }
        }
    }

    async findArticle(id: string): Promise<IArticle> {
        const article = await this.articleRepository.findById(id);
        if (!article) {
            throw new EntityDoesNotExist('Article not found.');
        }
        return article;
    }


    async findWords(words: string[]): Promise<WordOffsetsMap[]> {
        const finalRes: WordOffsetsMap[] = [];
        for (const word of words) {
            const res = await getTopKItemsFromSortedSet<IWord>(word)
            finalRes.push({[word]: res})
        }
        return finalRes;
    }


    async findMostCommonWords(word: string): Promise<string> {
        const mostCommonWordsRes = await getTopKItemsFromSortedSet<IWord>(word, 1)
        return mostCommonWordsRes.length > 0 ? mostCommonWordsRes[0].article_id : '';
    }
}

export default ArticleService;
