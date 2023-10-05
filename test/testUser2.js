import io from "socket.io-client";
import { CHAT } from "./common/Events.js";
import { BEARER_TOKEN_User2 } from "./common/Constants.js";

// telling socket.io-client to connect to which server.
const socket = io("http://localhost:5000/", {
  auth: { token: BEARER_TOKEN_User2 },
});
const username = "def";
const friend1 = "abc";

// socket.auth = { username };

/**
 * This event is listening to a "connect" event.
 * The reason why this event is automatically emitted is beause of socket.io-client library (answered by chat GPT).
 */
socket.on("connect", () => {
  console.log(`connected to server.`);

  /**
   * Here we are emitting an event called "chatMessage" with some message.
   * The server will listen to this event and will use our message as required.
   */
  // socket.emit('chatMessage', "This is a chat message by a client.");
});

socket.emit(CHAT, { to: friend1, message: "Hello!" });
socket.on(CHAT, (data) => {
  console.log(`${JSON.stringify(data)}`);
});

/**
 * We are listening to an event named "broadcastEvent".
 * In our case this event is used to test "broadcastEvent" feature of socket io sever library.
 */
socket.on("broadcastEvent", (message) => {});

/**
 * Listening to a "chatMessage" event, emitted by server.
 */
socket.on("chatMessage", (message) => {});
