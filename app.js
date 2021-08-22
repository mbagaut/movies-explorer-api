const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const BadRequestError = require('./errors/bad-request-error');
const limiter = require('./middlewares/rateLimit');
const error = require('./middlewares/error');
const { CURRENT_DB_ADRESS, MONGOOSE_CONFIG, CURRENT_PORT } = require('./configs');

const app = express();
app.use(cors());

// подключаемся к серверу mongo
mongoose.connect(`mongodb://${CURRENT_DB_ADRESS}/moviesdb`, MONGOOSE_CONFIG);

app.use('/', express.json()); // встроенный парсер express
app.use(helmet()); // настройка заголовков http для защиты от веб-уязвимостей
app.use(requestLogger); // логгер запросов

// лимитер после логгера, чтобы запросы отклоненные лимитером сохранились в логах
app.use(limiter);
app.use(routes);

app.use((req, res, next) => {
  next(new BadRequestError('Ресурс не найден'));
});

app.use(errorLogger); // логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(error); // централизованный обработчик

app.listen(CURRENT_PORT, () => {
  console.log(`App listening on port ${CURRENT_PORT}`);
});
