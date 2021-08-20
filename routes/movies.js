const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getSavedMovies,
  saveMovie,
  deleteMovie,
} = require('../controllers/movies');

const movieIdValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
});

const linkJoiValidation = Joi.string().required().pattern(new RegExp(/^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/));

router.get('/movies', getSavedMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: linkJoiValidation,
    trailer: linkJoiValidation,
    thumbnail: linkJoiValidation,
    movieId: Joi.string().required(),
    nameRU: Joi.string().required().min(2),
    nameEN: Joi.string().required().min(2),
  }),
}), saveMovie);
router.delete('/movies/:movieId', movieIdValidation, deleteMovie);

module.exports = router;
