const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
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
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      }
      next(err);
    });
};

const getSavedMovies = (req, res, next) => {
  Movie.find({})
    .populate('owner')
    .then((movies) => res.send(movies.reverse()))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError('Фильм по заданному id отсутствует в базе');
    })
    .then((movie) => {
      if (req.user._id === movie.owner.toHexString()) {
        return Movie.deleteOne(movie)
          .then(() => res.send({ data: movie }));
      }
      throw new ForbiddenError('Этот фильм сохранили не вы, его нельзя удалить');
    })
    .catch(next);
};

module.exports = {
  getSavedMovies,
  saveMovie,
  deleteMovie,
};
