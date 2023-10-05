import { PasswordType } from "../model/PasswordType";
import { UserEntity } from "../model/UserEntity";

export interface IUserRepository {
  /**
   * Add new user in database.
   * @param userEntity User of type UserEntity
   */
  addUser(userEntity: UserEntity): Promise<void>;

  /**
   * Update password of user.
   * @param username username of user.
   * @param newPassword new password of user.
   */
  updatePassword(username: string, newPassword: PasswordType): Promise<Boolean>;

  getUser(username: string): Promise<UserEntity>;
}
