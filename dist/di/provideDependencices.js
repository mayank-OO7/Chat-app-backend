import "reflect-metadata";
import { container } from "tsyringe";
import { I_CHAT_MESSAGE_REPOSITORY, I_USER_REPOSITORY, } from '../common/Constants.js';
import { UserRepository } from '../features/featureUser/data/repository/UserRepository.js';
import { ChatMessageRepository } from '../features/featureChat/data/repository/ChatMessageRepository.js';
container.registerSingleton(I_USER_REPOSITORY, UserRepository);
container.registerSingleton(I_CHAT_MESSAGE_REPOSITORY, ChatMessageRepository);
