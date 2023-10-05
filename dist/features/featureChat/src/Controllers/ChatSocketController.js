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
import { CHAT } from '../../../../common/Events.js';
import { logger } from '../../../../common/winstonLoggerConfiguration.js';
import { autoInjectable, inject } from "tsyringe";
import { I_CHAT_MESSAGE_REPOSITORY } from '../../../../common/Constants.js';
import { assertIsDefined } from '../../../../common/utils/assertIsDefined.js';
/**
 * Controller for handling chat socket events.
 */
export let ChatSocketController = class ChatSocketController {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
        /**
         * Handles the chat socket event and performs necessary actions.
         * @param chatMessageBody - The chat message body containing the recipient and message.
         * @param socket - The socket instance representing the connection.
         * @param onEmition - A callback function for emitting messages.
         */
        this.chatSocketHandler = async (chatMessageBody, socket, onEmition) => {
            assertIsDefined(this.chatRepository);
            const { to, message } = chatMessageBody;
            const from = socket.data.username;
            logger.info(`to: ${to} from: ${socket.data.username} message: ${message}`);
            socket.to(to).emit(CHAT, chatMessageBody); // Emit message to recipient
            const chatMessageEntity = {
                senderUsername: from,
                receiverUsername: to,
                message: message,
            };
            await this.chatRepository.addChatMessage(chatMessageEntity);
            const selfMessageBody = {
                to: from,
                message: message,
            };
            onEmition(selfMessageBody);
        };
    }
};
ChatSocketController = __decorate([
    autoInjectable(),
    __param(0, inject(I_CHAT_MESSAGE_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ChatSocketController);
