import winston from "winston";

const logConfiguration = {
  transports: [
    new winston.transports.File({
      filename: "logs/applicationLogs.log",
    }),
    // new winston.transports.Console({}),
  ],
  format: winston.format.combine(
    // winston.format.label({
    //   label: `Label🏷️`,
    // }),
    winston.format.colorize({
      colors: { info: "green", warn: "blue", error: "red", debug: "gray" },
    }),
    winston.format.timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    winston.format.printf(
      (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
    )
  ),
};

export const logger = winston.createLogger(logConfiguration);
