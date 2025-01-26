import {UserDAL} from "../dal/userDal";
import {IUser} from "../../domain/entities/IUser";

export class UserRepository {
    private userDAL = new UserDAL();

    async create(newUser: IUser): Promise<IUser> {
        return await this.userDAL.create(newUser) as IUser;
    }

    async findById(id: string): Promise<IUser> {
        return await this.userDAL.findByField('id', id) as IUser;
    }


    async findByEmail(email: string): Promise<IUser> {
        return await this.userDAL.findByField('email', email) as IUser;
    }


}
