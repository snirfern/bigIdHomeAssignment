

import {IUser} from "../../../../src/domain/entities/IUser";
import {UserDAL} from "../../../../src/infrastructure/dal/userDal";
import User from "../../../../src/infrastructure/models/User";

jest.mock("../../../../src/infrastructure/models/User");

const newUserMock: IUser = {
    id: "1",
    email: "test@example.com",
};

describe("UserDAL", () => {
    let userDal: UserDAL;

    beforeEach(() => {
        userDal = new UserDAL();
    });

    describe("create", () => {
        it("should create a new user and return it", async () => {
            (User.create as jest.Mock).mockResolvedValue(newUserMock);

            const createdUser = await userDal.create(newUserMock);

            expect(User.create).toHaveBeenCalledWith(newUserMock);
            expect(createdUser).toEqual(newUserMock);
        });

        it("should throw an error if creation fails", async () => {
            (User.create as jest.Mock).mockRejectedValue(new Error("Database error"));

            await expect(userDal.create(newUserMock)).rejects.toThrow("Database error");
        });
    });

    describe("findByField", () => {
        it("should return a user when found by field", async () => {
            (User.findOne as jest.Mock).mockResolvedValue(newUserMock);

            const foundUser = await userDal.findByField("email", "test@example.com");

            expect(User.findOne).toHaveBeenCalledWith({
                where: { email: "test@example.com" },
                rejectOnEmpty: false,
            });
            expect(foundUser).toEqual(newUserMock);
        });

        it("should return null when no user is found by field", async () => {
            (User.findOne as jest.Mock).mockResolvedValue(null);

            const foundUser = await userDal.findByField("email", "nonexistent@example.com");

            expect(User.findOne).toHaveBeenCalledWith({
                where: { email: "nonexistent@example.com" },
                rejectOnEmpty: false,
            });
            expect(foundUser).toBeNull();
        });

        it("should throw an error if the find operation fails", async () => {
            (User.findOne as jest.Mock).mockRejectedValue(new Error("Database error"));

            await expect(userDal.findByField("email", "test@example.com")).rejects.toThrow("Database error");
        });
    });
});
