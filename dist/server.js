import "dotenv/config";
import { httpServer } from './features/app.js';
import { env } from './common/utils/envalidUtils.js';
import mongoose from "mongoose";
import { logger } from './common/winstonLoggerConfiguration.js';
(() => {
    const PORT = env.PORT || 5000;
    const DB_STRING = env.DB_STRING;
    mongoose
        .connect(DB_STRING)
        .then(() => {
        logger.info("mongoose connected");
        httpServer.listen(PORT, () => {
            console.log(`server up on http://localhost:${PORT}`);
        });
    })
        .catch((err) => {
        logger.error(err);
    });
})();
