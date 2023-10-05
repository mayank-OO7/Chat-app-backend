export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  chat: (chatMessageBody: ChatMessageBody) => string;
}

export type ChatMessageBody = { to: string; message: string };

export interface ClientToServerEvents {
  chat: (chatMessageBody: ChatMessageBody) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  username: string;
}
