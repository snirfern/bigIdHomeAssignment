import {DataTypes, Model, Sequelize} from 'sequelize';
import Article from './Article';
import {v4 as uuidv4} from "uuid";

class Comment extends Model {
    public id: string;
    public text: string;
    public articleId: string;

    public static initModel(sequelize: Sequelize) {
        Comment.init(
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true,
                    defaultValue: uuidv4
                },
                text: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                articleId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: Article,
                        key: 'id',
                    },
                },
            },
            {
                sequelize,
                modelName: 'Comment',
                tableName: 'comments',
                timestamps: false
            }
        );
    }
}

export default Comment;
