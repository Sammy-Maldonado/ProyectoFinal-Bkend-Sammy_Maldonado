import LoggerService from "../services/LoggerServices.js";
import config from "../config/config.js";

const loggerService = new LoggerService(config.app.LOGGER_ENV);

const attachLogger = (req, res, next) => {
  req.logger = loggerService.logger;
  req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString}`);
  next();
}

export default attachLogger;