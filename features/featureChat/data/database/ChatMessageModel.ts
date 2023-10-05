import { InferSchemaType, Schema, model } from "mongoose";

const ChatMessageSchema = new Schema(
  {
    senderUsername: {
      type: String,
      required: true,
    },

    receiverUsername: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export type ChatMessageType = InferSchemaType<typeof ChatMessageSchema>;

export const ChatMessageModel = model<ChatMessageType>(
  "ChatMessage",
  ChatMessageSchema
);
