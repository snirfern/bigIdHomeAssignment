import {ArticleRepository} from "../../infrastructure/repositories/articleRepository";
import {EntityCreationFailure, EntityDoesNotExist} from "../errrors/errors";
import {IArticle} from "../entities/IArticle";
import {extractWordsOffsets} from "../../infrastructure/utils/utils";
import {RedisClient, RedisConnectionManager} from "../../infrastructure/framework/redis/redis";
import {DatabaseError, UniqueConstraintError, ValidationError} from 'sequelize';
import config from "../../config/config";

interface IWord {
    offsets: number[];
    article_id: string;
}

interface WordOffsetsMap {
    [word: string]: IWord;
}


class ArticleService {
    private articleRepository: ArticleRepository;
    private redis: RedisClient;

    constructor() {
        this.articleRepository = new ArticleRepository();
        this.redis = RedisConnectionManager.getConnection(config.dataSources.redis.dbConfig)
    }

    async createArticle(newArticleData: IArticle): Promise<IArticle> {
        try {

            await this.articleRepository.findByAuthorId(newArticleData.authorId);


            const newArticle = await this.articleRepository.create(newArticleData);
            const wordsDict = extractWordsOffsets(newArticle.content);
            for (const word of Object.keys(wordsDict)) {
                wordsDict[word].article_id = newArticle.id;
                await this.redis.addItemsToSet(word, () => wordsDict[word].offsets.length ?? 0, [wordsDict[word]]);
            }

            return newArticle;

        } catch (error) {
            if (error instanceof ValidationError || error instanceof DatabaseError || error instanceof UniqueConstraintError) {
                throw new EntityCreationFailure('Entity creation failed.corrupted body data.');
            } else {
                throw error;
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
        let wordsRes = [];
        for (const word of words) {
            const wordsDistribution = await this.redis.getTopScoreItem(word)
            if (wordsDistribution) {
                wordsRes.push(wordsDistribution)
            }
        }
        return wordsRes;
    }


    async findMostCommonWords(word: string): Promise<string> {
        const mostCommonWordsRes = await this.redis.getTopKItemsFromSortedSet(word, -1, -1)
        return mostCommonWordsRes[0].article_id
    }
}

export default ArticleService;
