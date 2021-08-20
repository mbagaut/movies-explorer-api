const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const InternalServerError = require('../errors/internal-server-error');
const ForbiddenError = require('../errors/forbidden-error');

const saveMovie = (req, res, next) => {
  const { _id } = req.user;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: _id,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const getSavedMovies = (req, res, next) => {
  Movie.find({})
    .populate('owner')
    .then((movies) => res.status(200).send(movies.reverse()))
    .catch(() => next(new InternalServerError('Ошибка сервера')));
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError('Фильм по заданному id отсутствует в базе');
    })
    .then((movie) => {
      if (req.user._id === movie.owner.toHexString()) {
        Movie.deleteOne(movie)
          .then(() => res.status(200).send({ data: movie }));
      } else {
        throw new ForbiddenError('Этот фильм сохранили не вы, его нельзя удалить');
      }
    })
    .catch((err) => {
      if (err.statusCode === 404 || err.statusCode === 403) {
        next(err);
      } else {
        next(new InternalServerError('Ошибка сервера'));
      }
    });
};

module.exports = {
  getSavedMovies,
  saveMovie,
  deleteMovie,
};
