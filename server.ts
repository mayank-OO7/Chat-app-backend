import "dotenv/config";
import { httpServer } from "./features/app";
import { env } from "./common/utils/envalidUtils";
import mongoose from "mongoose";
import { logger } from "./common/winstonLoggerConfiguration";

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
