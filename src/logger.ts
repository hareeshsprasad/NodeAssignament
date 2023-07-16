import { decodeJWT } from './modules/user/user.model';
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: 'logs/api.log' })],
});

const logAPICalls = (req, res, next) => {
  try {
    const payload:any = decodeJWT(req.headers.authorization);
    const timestamp = new Date().toLocaleTimeString('en-us', {
      hour12: true,
    });
    logger.info(`${req.method} ${req.url} API Requested at ${timestamp} By User ${payload.Name} `);
  } catch (error) {
    logger.error(`Error logging API call: ${error.message}`);
  }
  next();
};

module.exports = { logger, logAPICalls };
