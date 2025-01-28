import {UserDAL} from "../dal/userDal";
import {IUser} from "../../domain/entities/IUser";

export class UserRepository {
    private userDAL = new UserDAL();

    create(newUser: IUser): Promise<IUser> {
        return this.userDAL.create(newUser);
    }

    async findById(id: string): Promise<IUser | null> {
        return this.userDAL.findByField('id', id);
    }


    async findByEmail(email: string): Promise<IUser | null> {
        return this.userDAL.findByField('email', email);
    }


}
