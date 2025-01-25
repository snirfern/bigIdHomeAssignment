import {ModelStatic, Sequelize} from 'sequelize';
import config from '../../../config/config';
import User from "../../models/User";
import Article from "../../models/Article";
import Comment from "../../models/Comment"
import logger from "../../logger/logger";

class SequelizeDB {
    private readonly sequelize: Sequelize;

    constructor() {
        this.sequelize = new Sequelize(config.dataSources.sequelize.dbConfig);
    }

    async connect() {
        try {
            await this.sequelize.authenticate();
            await this.sequelize.sync({ force: true })
            await this.initModels()

            logger.info('Connection to the database has been established successfully.');
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

    async initModels() {

        User.initModel(this.sequelize);
        Article.initModel(this.sequelize);
        Comment.initModel(this.sequelize);

        User.hasMany(Article as ModelStatic<Article>, {foreignKey: 'authorId'});
        Article.belongsTo(User as ModelStatic<User>, {foreignKey: 'authorId'});

        Article.hasMany(Comment as ModelStatic<Comment>, {foreignKey: 'articleId'});
        Comment.belongsTo(Article as ModelStatic<Article>,{foreignKey: 'articleId'})
    }

}

export default new SequelizeDB();
