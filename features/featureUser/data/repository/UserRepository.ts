import createHttpError from "http-errors";
import { logger } from "../../../../common/winstonLoggerConfiguration";
import { PasswordType } from "../../domain/model/PasswordType";
import { UserEntity } from "../../domain/model/UserEntity";
import { IUserRepository } from "../../domain/repository/IUserRepository";
import { UserModel } from "../database/UserModel";
import { injectable, singleton } from "tsyringe";

@injectable()
@singleton()
/**
 * `UserRepository` immplementing `IUserRepository`
 */
export class UserRepository implements IUserRepository {
  constructor() {}

  /**
   * create new user of type `UserEntity`
   * @param userEntity new user of type `UserEntity`
   */
  async addUser(userEntity: UserEntity) {
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
  async updatePassword(
    username: string,
    newPassword: PasswordType
  ): Promise<Boolean> {
    const userExist = await UserModel.findOne({ username: username });
    if (!userExist) throw createHttpError(404, "User not found");

    const updateResult = await UserModel.updateOne(
      { username: username },
      { password: newPassword }
    ).exec();

    return updateResult.acknowledged;
  }

  /**
   * get user by specified username.
   * @param username username of user (string)
   * @returns user of type `UserEntity`
   */
  async getUser(username: string): Promise<UserEntity> {
    const user = await UserModel.findOne({ username: username });

    if (!user) {
      throw createHttpError(401, "invalid username or password");
    }

    const userEntity: UserEntity = {
      username: user.username,
      password: {
        salt: user.password.salt,
        hash: user.password.hash,
      },
    };

    return userEntity;
  }
}
