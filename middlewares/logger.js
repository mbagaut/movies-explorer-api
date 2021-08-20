const { format, transports } = require('winston');

const { combine, printf } = format;
const expressWinston = require('express-winston');
const path = require('path');

const dirPath = path.join(__dirname, '../logs');

const myFormat = printf(({
  level,
  message,
  timestamp,
  ...metadata
}) => {
  let msg = `${timestamp} [${level}] : ${message} `;
  if (metadata) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

const options = {
  filename: '',
  format: combine(
    // colorize(),
    // splat(),
    format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
    // align(),
    myFormat,
  ),
};

// логгер запросов
const requestLogger = expressWinston.logger({
  transports: [
    new transports.File({
      ...options,
      filename: path.join(dirPath, 'request.log'),
    }),
  ],
});

// логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new transports.File({
      ...options,
      filename: path.join(dirPath, 'error.log'),
    }),
  ],
});

module.exports = {
  requestLogger,
  errorLogger,
};
