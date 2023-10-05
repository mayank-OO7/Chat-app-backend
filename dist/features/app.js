import "reflect-metadata";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { CHAT, CONNECTION } from '../common/Events.js';
import { ChatSocketController } from './featureChat/src/Controllers/ChatSocketController.js';
import userRouter from './featureUser/src/routes/userRoutes.js';
import createHttpError, { isHttpError } from "http-errors";
import { logger } from '../common/winstonLoggerConfiguration.js';
import { dirname } from "path";
import { fileURLToPath } from "url";
import { getTokenParts, getUsernameFromToken } from './common/utils/jwtUtils.js';
import '../di/provideDependencices.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    // logger.info("user requested default page");
    return res.status(200).json({ success: true });
});
app.use("/user", userRouter);
app.use((_req, _res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});
app.use((error, _req, res, next) => {
    logger.error(error);
    let errorMessage = "An unknown error occurred.";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    return res.status(statusCode).json({ success: false, message: errorMessage });
});
export const httpServer = createServer(app);
const io = new Server(httpServer);
io.use((socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        // logger.info(`token is ${token}`);
        if (!token) {
            return next(new Error("Authentication failed"));
        }
        const tokenPart = getTokenParts(token);
        const username = getUsernameFromToken(tokenPart[1]);
        // logger.info(`${username}`);
        socket.data.username = username;
        next();
    }
    catch (error) {
        logger.error(error);
        let errorMessage = "";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        const tsError = new Error(errorMessage);
        next(tsError);
    }
});
io.on(CONNECTION, (socket) => {
    const { username } = socket.data;
    socket.join(username);
    socket.on(CHAT, (chatMessageBody) => {
        new ChatSocketController().chatSocketHandler(chatMessageBody, socket, (message) => {
            io.to(username).emit(CHAT, message);
        });
    });
    const chatMessageBody = {
        to: username,
        message: "hello",
    };
    socket.to(username).emit(CHAT, chatMessageBody);
});
