import "reflect-metadata";
import { container } from "tsyringe";
import {
  I_CHAT_MESSAGE_REPOSITORY,
  I_USER_REPOSITORY,
} from "../common/Constants";
import { IUserRepository } from "../features/featureUser/domain/repository/IUserRepository";
import { UserRepository } from "../features/featureUser/data/repository/UserRepository";
import { IChatMessageRepository } from "../features/featureChat/domain/repository/IChatMessageRepository";
import { ChatMessageRepository } from "../features/featureChat/data/repository/ChatMessageRepository";

container.registerSingleton<IUserRepository>(I_USER_REPOSITORY, UserRepository);
container.registerSingleton<IChatMessageRepository>(
  I_CHAT_MESSAGE_REPOSITORY,
  ChatMessageRepository
);
