import { Socket } from "socket.io";
import { ChatMessageBody } from "../../../common/SocketEvents";
import { CHAT } from "../../../../common/Events";
import { logger } from "../../../../common/winstonLoggerConfiguration";
import { autoInjectable, inject } from "tsyringe";
import { I_CHAT_MESSAGE_REPOSITORY } from "../../../../common/Constants";
import { IChatMessageRepository } from "../../domain/repository/IChatMessageRepository";
import { assertIsDefined } from "../../../../common/utils/assertIsDefined";
import { ChatMessageEntity } from "../../domain/model/ChatMessageEntity";

/**
 * Controller for handling chat socket events.
 */
@autoInjectable()
export class ChatSocketController {
  constructor(
    @inject(I_CHAT_MESSAGE_REPOSITORY)
    private chatRepository?: IChatMessageRepository
  ) {}

  /**
   * Handles the chat socket event and performs necessary actions.
   * @param chatMessageBody - The chat message body containing the recipient and message.
   * @param socket - The socket instance representing the connection.
   * @param onEmition - A callback function for emitting messages.
   */
  chatSocketHandler = async (
    chatMessageBody: ChatMessageBody,
    socket: Socket,
    onEmition: (message: ChatMessageBody) => void
  ) => {
    assertIsDefined(this.chatRepository);

    const { to, message } = chatMessageBody;
    const from = socket.data.username;

    logger.info(`to: ${to} from: ${socket.data.username} message: ${message}`);

    socket.to(to).emit(CHAT, chatMessageBody); // Emit message to recipient

    const chatMessageEntity: ChatMessageEntity = {
      senderUsername: from,
      receiverUsername: to,
      message: message,
    };

    await this.chatRepository.addChatMessage(chatMessageEntity);

    const selfMessageBody: ChatMessageBody = {
      to: from,
      message: message,
    };

    onEmition(selfMessageBody);
  };
}
