import User from '../models/User';
import {IUser} from "../../domain/entities/IUser";

export class UserDAL {
    async createUser(newUser: Partial<IUser>) {
        return await User.create(newUser);
    }

    async findByField(field: string, value: string) {
        return await User.findOne({where: {[field]: value}, rejectOnEmpty: false});
    }

}
