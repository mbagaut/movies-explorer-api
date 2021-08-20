const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  changeProfile,
  getUserProfile,
} = require('../controllers/users');

router.get('/users/me', getUserProfile);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2),
    email: Joi.string().required().email(),
  }),
}), changeProfile);

module.exports = router;
