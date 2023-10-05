var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { autoInjectable, inject } from "tsyringe";
import { I_USER_REPOSITORY } from '../../../../common/Constants.js';
import createHttpError from "http-errors";
import { genPassword, issueJWT } from '../../../common/utils/jwtUtils.js';
export let CreateUserController = class CreateUserController {
    constructor(userRepository) {
        this.userRepository = userRepository;
        /**
         * Request handler to for creating a user ("/user/signup")
         * @param req Express Request object
         * @param res Express Response object
         * @param next Express Next Function
         * @returns void
         */
        this.createUserHandler = async (req, res, next) => {
            try {
                const { username, password } = req.body;
                if (!username || !password) {
                    throw createHttpError(412, "Username and Password is required");
                }
                const passwordHashed = genPassword(password);
                const userEntity = {
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
            }
            catch (error) {
                // logger.error(error);
                next(error);
            }
        };
    }
};
CreateUserController = __decorate([
    autoInjectable(),
    __param(0, inject(I_USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreateUserController);
