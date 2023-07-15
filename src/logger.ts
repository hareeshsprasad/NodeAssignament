import { decodeJWT } from "./modules/user/user.model";
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', 
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/api.log' }) 
  ]
});

const logAPICalls = (req, res, next) => {
  const payload: any = decodeJWT(req.headers.authorization);
  const timestamp = new Date().toLocaleTimeString( 'en-us',{
    hour12: true,
  });
  logger.info(`${req.method} ${req.url} API Requested By ${payload.Name} at ${timestamp}`);
  next();
};

module.exports = { logger, logAPICalls };
