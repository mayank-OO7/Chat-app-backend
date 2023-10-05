import { ChatMessageEntity } from "../model/ChatMessageEntity";

export type IChatMessageRepository = {
  addChatMessage(message: ChatMessageEntity): Promise<void>;
  getChatMessages(username: string): Promise<ChatMessageEntity[]>;
};
