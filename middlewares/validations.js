const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const linkJoiValidation = Joi.string().required().custom((value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message('Ссылка должна быть валидным url-адресом');
});

const userPatchProfileValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    name: Joi.string().required(),
  }),
});

const moviePostValidate = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: linkJoiValidation,
    trailer: linkJoiValidation,
    thumbnail: linkJoiValidation,
    movieId: Joi.number().required().integer(),
    nameRU: Joi.string().required().min(2),
    nameEN: Joi.string().required().min(2),
  }),
});

const movieDeleteIdValidate = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required(),
  }),
});

module.exports = {
  userPatchProfileValidate,
  movieDeleteIdValidate,
  moviePostValidate,
};
