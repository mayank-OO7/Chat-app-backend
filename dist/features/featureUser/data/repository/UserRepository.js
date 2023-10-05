var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import createHttpError from "http-errors";
import { UserModel } from '../database/UserModel.js';
import { injectable, singleton } from "tsyringe";
export let UserRepository = class UserRepository {
    constructor() { }
    /**
     * create new user of type `UserEntity`
     * @param userEntity new user of type `UserEntity`
     */
    async addUser(userEntity) {
        const username = userEntity.username;
        const userDb = await UserModel.findOne({ username: username });
        if (userDb) {
            throw createHttpError(409, "Username already exist");
        }
        await UserModel.create(userEntity);
    }
    /**
     * Method to update password of user.
     * @param username username of new user (string)
     * @param newPassword new password of user (string)
     * @returns `true` is user updated, `false` otherwise.
     */
    async updatePassword(username, newPassword) {
        const userExist = await UserModel.findOne({ username: username });
        if (!userExist)
            throw createHttpError(404, "User not found");
        const updateResult = await UserModel.updateOne({ username: username }, { password: newPassword }).exec();
        return updateResult.acknowledged;
    }
    /**
     * get user by specified username.
     * @param username username of user (string)
     * @returns user of type `UserEntity`
     */
    async getUser(username) {
        const user = await UserModel.findOne({ username: username });
        if (!user) {
            throw createHttpError(401, "invalid username or password");
        }
        const userEntity = {
            username: user.username,
            password: {
                salt: user.password.salt,
                hash: user.password.hash,
            },
        };
        return userEntity;
    }
};
UserRepository = __decorate([
    injectable(),
    singleton()
    /**
     * `UserRepository` immplementing `IUserRepository`
     */
    ,
    __metadata("design:paramtypes", [])
], UserRepository);
