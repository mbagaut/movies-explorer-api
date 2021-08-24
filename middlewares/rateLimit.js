const rateLimit = require('express-rate-limit');
// const RateLimitError = require('../errors/rate-limit-error');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Достигнут лимит запросов с вашего IP, повторите попытку позже',
});

module.exports = limiter;
