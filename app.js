require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const BadRequestError = require('./errors/bad-request-error');

app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Достигнут лимит запросов с вашего IP, повторите попытку позже',
});

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use('/', express.json()); // встроенный парсер express
app.use(helmet()); // настройка заголовков http для защиты от веб-уязвимостей

app.use(requestLogger); // подключаем логгер запросов до всех обработчиков

// подключаем лимитер после логгера, чтобы запросы отклоненные лимитером сохранились в логах
app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use(auth);

app.use('/', userRouter);
app.use('/', movieRouter);

app.use((req, res, next) => {
  next(new BadRequestError('Ресурс не найден'));
});

// подключаем логгер ошибок после всех обработчиков
app.use(errorLogger);
// обработчик ошибок celebrate
app.use(errors());
// централизованный обработчик
app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: 'Ошибка сервера' });
  }
  next(); // бесполезный вызов, чтобы линтер не ругался
});

module.exports = app;
