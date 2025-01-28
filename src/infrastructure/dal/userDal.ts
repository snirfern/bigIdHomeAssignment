import User from '../models/User';
import {IUser} from "../../domain/entities/IUser";
import {IBaseDal} from "./interface";

export class UserDAL implements IBaseDal<User, IUser> {
    async create(newUser: Partial<IUser>): Promise<User> {
        return User.create(newUser);
    }

    async findByField(field: string, value: string): Promise<User | null> {
        return User.findOne({where: {[field]: value}, rejectOnEmpty: false});
    }

}
