const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');
const { CURRENT_JWT_SECRET } = require('../configs');

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  if (!password) {
    throw new BadRequestError('Упс! Что-то пошло не так, проверьте корректность введенного пароля');
  } else {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name,
        email,
        password: hash,
      }))
      .then((user) => {
        res.status(201).send({
          _id: user._id,
          email: user.email,
          name: user.name,
        });
      })
      .catch((err) => {
        if (err.name === 'ValidationError' || err.name === 'CastError') {
          next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
        } else if (err.name === 'MongoError' && err.code === 11000) {
          next(new ConflictError('Данная почта уже зарегистрирована'));
        } else {
          next(err);
        }
      });
  }
};

function validateEmailAccessibility(email) {
  return User.findOne({ email })
    .then((result) => (result === null ? false : result._id));
}

const changeProfile = (req, res, next) => {
  const { _id } = req.user;
  const { name, email } = req.body;
  validateEmailAccessibility(email)
    .then((userId) => {
      if (userId === false || userId.toString() === _id.toString()) {
        User.findByIdAndUpdate(_id, { name, email },
          {
            new: true,
            runValidators: true,
          })
          .orFail(() => {
            throw new NotFoundError('Пользователь по заданному id отсутствует в базе');
          })
          .then((user) => res.send(user))
          .catch((err) => {
            if (err.name === 'ValidationError' || err.name === 'CastError') {
              next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
            } else {
              next(err);
            }
          });
      } else {
        throw new ConflictError('Данная почта уже зарегистрирована');
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        CURRENT_JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.status(200).json({ token });
    })
    .catch((err) => {
      if (err.name === 'AuthorizationError') {
        next(new UnauthorizedError(err.message));
      } else if (!email || !password) {
        next(new BadRequestError('Не передан один из требуемых параметров в body'));
      } else {
        next(err);
      }
    });
};

const getUserProfile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь по заданному id отсутствует в базе');
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  changeProfile,
  login,
  getUserProfile,
};
