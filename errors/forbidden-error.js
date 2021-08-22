const { FORBIDDEN_ERROR } = require('../utils/errors-codes');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN_ERROR;
  }
}

module.exports = ForbiddenError;
