import { autoInjectable, inject } from "tsyringe";
import { IUserRepository } from "../../domain/repository/IUserRepository";
import { I_USER_REPOSITORY } from "../../../../common/Constants";
import { RequestHandler } from "express";
import { UserEntity } from "../../domain/model/UserEntity";
import createHttpError from "http-errors";
import { logger } from "../../../../common/winstonLoggerConfiguration";
import { assertIsDefined } from "../../../../common/utils/assertIsDefined";
import { genPassword, issueJWT } from "../../../common/utils/jwtUtils";

interface createUserBody {
  username?: string;
  password?: string;
}

@autoInjectable()
export class CreateUserController {
  constructor(
    @inject(I_USER_REPOSITORY) private userRepository?: IUserRepository
  ) {}

  /**
   * Request handler to for creating a user ("/user/signup")
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express Next Function
   * @returns void
   */
  createUserHandler: RequestHandler<unknown, unknown, createUserBody, unknown> =
    async (req, res, next) => {
      try {
        const { username, password } = req.body;
        if (!username || !password) {
          throw createHttpError(412, "Username and Password is required");
        }
        const passwordHashed = genPassword(password);
        const userEntity: UserEntity = {
          username: username,
          password: passwordHashed,
        };
        if (!this.userRepository)
          throw createHttpError(500, "Internal server error");
        await this.userRepository.addUser(userEntity);

        const jwtToken = issueJWT(username);

        return res.status(201).json({
          success: true,
          message: "user created successfully.",
          token: jwtToken.token,
        });
      } catch (error) {
        // logger.error(error);
        next(error);
      }
    };
}
