var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable, singleton } from "tsyringe";
import { ChatMessageModel } from '../database/ChatMessageModel.js';
/**
 * ChatMessageRepository is responsible for interacting with the chat message data storage.
 */
export let ChatMessageRepository = class ChatMessageRepository {
    /**
     * Add a chat message to the data storage.
     * @param message - The chat message to be added.
     * @returns A promise that resolves when the operation is completed.
     */
    async addChatMessage(message) {
        await ChatMessageModel.create(message);
    }
    /**
     * Get chat messages based on the provided username.
     * Retrieves chat messages where either the senderUsername or receiverUsername matches the given username.
     * @param username - The username to retrieve chat messages for.
     * @returns A promise that resolves to an array of ChatMessageEntity representing the chat messages.
     */
    async getChatMessages(username) {
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
};
ChatMessageRepository = __decorate([
    injectable(),
    singleton()
], ChatMessageRepository);
