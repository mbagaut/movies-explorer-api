const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { signInValidate, signUpValidate } = require('../middlewares/validations');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', signInValidate, login);
router.post('/signup', signUpValidate, createUser);

router.use(auth);

router.use('/', userRouter);
router.use('/', movieRouter);

module.exports = router;
