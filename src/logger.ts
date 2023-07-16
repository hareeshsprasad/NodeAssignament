import { decodeJWT } from "./modules/user/user.model";
const winston = require("winston");
import * as fs from "fs";
import * as path from "path";
const moment = require("moment");
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "logs/api.log" })],
});

const logAPICalls = (req, res, next) => {
  try {
    const payload: any = decodeJWT(req.headers.authorization);
    const timestamp = new Date().toLocaleTimeString("en-us", {
      hour12: true,
    });
    logger.info(
      `${req.method} ${req.url} API Requested at ${timestamp} By User ${payload.Name} `
    );
  } catch (error) {
    // logger.error(`No API Request Made`);
  }
  next();
};

module.exports = { logger, logAPICalls };
setInterval(() => {
  logAPICalls({}, {}, () => {});
  console.log("logAPICalls executed.");
}, 1 * 60 * 1000);

async function deleteOldLogs() {
  const logFilePath = path.join(__dirname, "./../logs/api.log");
  const logData = await fs.promises.readFile(logFilePath, "utf8");
  if (logData) {
    const logs = logData
      .trim()
      .split("\n")
      .map((logEntry) => JSON.parse(logEntry));

    const currentTime = moment();
    const thresholdTime = moment().subtract(1, "minutes");

    const filteredLogs = logs.filter((log) => {
      const logTime = moment(log.message, "h:mm:ss A");
      return logTime.isAfter(thresholdTime);
    });

    const newLogData = filteredLogs
      .map((log) => JSON.stringify(log))
      .join("\n");
    await fs.promises.writeFile(logFilePath, newLogData, "utf8");
  }
}
setInterval(() => {
  deleteOldLogs()
    .then(() => {
      console.log("Old logs deleted successfully.");
    })
    .catch((error) => {
      console.error("Error deleting old logs:", error);
    });
}, 5 * 60 * 1000);