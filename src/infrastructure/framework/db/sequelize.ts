import {ModelStatic, Sequelize} from 'sequelize';
import config from '../../../config/config';
import User from "../../models/User";
import Article from "../../models/Article";
import Comment from "../../models/Comment"
import logger from "../../logger/logger";

class SequelizeDB {
    private readonly sequelize: Sequelize;

    constructor() {
        this.sequelize = new Sequelize({...config.dataSources.sequelize.dbConfig, logging: false});
    }


    async connect() {
        try {
            await this.sequelize.authenticate();
            if (process.env.NODE_ENV === 'test') {
                await this.dropAllTables();
            }
            await this.initModels()

            await this.sequelize.sync({force: true})
            logger.info('Connection to the database has been established successfully.');
            return this;
        } catch (error) {
            logger.error(`Unable to connect to the database:${error}`);
            throw error;
        }
    }

    async disconnect() {
        try {
            await this.sequelize.close();
            logger.info('Connection to the database has been closed successfully.');
        } catch (error) {
            logger.error(`Unable to disconnect from the database:\n ${error}`);
            throw error;
        }
    }

    async seedDatabase() {
        await User.create({id: '123e4567-e89b-12d3-a456-426614174000', email: 'user@example.com'});
        await Article.create({
            id: '123e4567-e89b-12d3-a456-426614174001',
            title: 'Demo Article',
            content: 'This is a demo article content.',
            authorId: '123e4567-e89b-12d3-a456-426614174000'
        });
        await Comment.create({
            id: '123e4567-e89b-12d3-a456-426614174002',
            text: 'This is a demo comment.',
            articleId: '123e4567-e89b-12d3-a456-426614174001'
        })
    }

    private async dropAllTables() {
        try {
            const res = await this.sequelize.drop();
            logger.info('All existing tables have been dropped successfully.');
        } catch (error) {
            logger.error(`Error while dropping tables: ${error}`);
            throw error;
        }
    }

    async initModels() {

        User.initModel(this.sequelize);
        Article.initModel(this.sequelize);
        Comment.initModel(this.sequelize);


        User.hasMany(Article as ModelStatic<Article>, {foreignKey: 'authorId'});
        Article.belongsTo(User as ModelStatic<User>, {foreignKey: 'authorId'});

        Article.hasMany(Comment as ModelStatic<Comment>, {foreignKey: 'articleId'});
        Comment.belongsTo(Article as ModelStatic<Article>, {foreignKey: 'articleId'})
    }

}

export default new SequelizeDB();
