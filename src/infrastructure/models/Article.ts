import { DataTypes, Model, Sequelize } from 'sequelize';
import User from './User';
import Comment from './Comment';
import {v4 as uuidv4} from "uuid";

class Article extends Model {
    public id: string;
    public title: string;
    public content: string;
    public authorId: string;

    public static initModel(sequelize: Sequelize) {
        Article.init(
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true,
                    defaultValue: uuidv4,
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                content: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                authorId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: User,
                        key: 'id',
                    },
                },
            },
            {
                sequelize,
                modelName: 'Article',
                tableName: 'articles',
                timestamps:false
            }
        );
    }

    public static associate() {
        Article.belongsTo(User, { foreignKey: 'authorId' });
        Article.hasMany(Comment, { foreignKey: 'articleId' });
    }
}

export default Article;
