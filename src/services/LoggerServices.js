import winston from 'winston';
export default class LoggerService {
  constructor(env) {
    this.options = {
      levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
      },
      colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        http: 'green',
        info: 'white',
        debug: 'cyan',
      },
    };
    this.logger = this.createLogger(env);
  }

  createLogger = (env) => {
    switch (env) {
      case "DEVELOPMENT":
        return winston.createLogger({
          levels: this.options.levels,
          transports: [
            new winston.transports.Console({
              level: "debug",
              format: winston.format.combine(
                winston.format.colorize({ colors: this.options.colors }),
                winston.format.simple()
              ),
            })
          ]
        })
      case "PRODUCTION":
        return winston.createLogger({
          levels: this.options.levels,
          transports: [
            new winston.transports.Console({
              level: "info",
              format: winston.format.combine(
                winston.format.colorize({ colors: this.options.colors }),
                winston.format.simple()
              ),
            }),
            new winston.transports.File({
              level: "error",
              filename: './errors.log'
            })
          ]
        })
    }
  }
}