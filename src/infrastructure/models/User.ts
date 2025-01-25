import { DataTypes, Model, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

class User extends Model {
    public id: string;
    public email: string;

    public static initModel(sequelize: Sequelize) {
        User.init(
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true,
                    defaultValue: uuidv4,
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                },
            },
            {
                sequelize,
                modelName: 'User',
                tableName: 'users',
                timestamps:false
            }
        );
    }
}

export default User;
