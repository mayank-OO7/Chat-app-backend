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
import { assertIsDefined } from '../../../../common/utils/assertIsDefined.js';
import { validPassword, issueJWT } from '../../../common/utils/jwtUtils.js';
export let SignInController = class SignInController {
    constructor(userRepository) {
        this.userRepository = userRepository;
        /**
         * Request handler to for signing in a user ("/user/signin")
         * @param req Express Request object
         * @param res Express Response object
         * @param next Express Next Function
         * @returns void
         */
        this.signInHandler = async (req, res, next) => {
            try {
                assertIsDefined(this.userRepository);
                const { username, password } = req.body;
                if (!username || !password) {
                    throw createHttpError(412, "In sufficient credentials");
                }
                const userEntity = await this.userRepository.getUser(username);
                // logger.info(JSON.stringify(userEntity));
                const passwordHashed = {
                    salt: userEntity.password.salt,
                    hash: userEntity.password.hash,
                };
                const isPasswordValid = validPassword(password, passwordHashed);
                if (!isPasswordValid) {
                    throw createHttpError(401, "invalid username or password");
                }
                const jwt = issueJWT(username);
                return res.status(200).json({ success: true, token: jwt.token });
            }
            catch (error) {
                next(error);
            }
        };
    }
};
SignInController = __decorate([
    autoInjectable(),
    __param(0, inject(I_USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], SignInController);
