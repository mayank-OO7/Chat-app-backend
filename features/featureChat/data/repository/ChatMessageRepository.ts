import { injectable, singleton } from "tsyringe";
import { IChatMessageRepository } from "../../domain/repository/IChatMessageRepository";
import { ChatMessageEntity } from "../../domain/model/ChatMessageEntity";
import { ChatMessageModel } from "../database/ChatMessageModel";

/**
 * ChatMessageRepository is responsible for interacting with the chat message data storage.
 */
@injectable()
@singleton()
export class ChatMessageRepository implements IChatMessageRepository {
  /**
   * Add a chat message to the data storage.
   * @param message - The chat message to be added.
   * @returns A promise that resolves when the operation is completed.
   */
  async addChatMessage(message: ChatMessageEntity): Promise<void> {
    await ChatMessageModel.create(message);
  }

  /**
   * Get chat messages based on the provided username.
   * Retrieves chat messages where either the senderUsername or receiverUsername matches the given username.
   * @param username - The username to retrieve chat messages for.
   * @returns A promise that resolves to an array of ChatMessageEntity representing the chat messages.
   */
  async getChatMessages(username: string): Promise<ChatMessageEntity[]> {
    const chatMessages = await ChatMessageModel.find({
      $or: [{ senderUsername: username }, { receiverUsername: username }],
    });

    // Map Mongoose documents to ChatMessageEntity
    const chatMessageEntities = chatMessages.map((chatMessage) => {
      return {
        senderUsername: chatMessage.senderUsername,
        receiverUsername: chatMessage.receiverUsername,
        message: chatMessage.message,
      };
    });

    return chatMessageEntities;
  }
}
