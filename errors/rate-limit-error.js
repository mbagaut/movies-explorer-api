const { RATE_LIMIT_ERROR } = require('../utils/errors-codes');

class RateLimitError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = RATE_LIMIT_ERROR;
  }
}

module.exports = RateLimitError;
