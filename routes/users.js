const router = require('express').Router();
const { userPatchProfileValidate } = require('../middlewares/validations');

const {
  changeProfile,
  getUserProfile,
} = require('../controllers/users');

router.get('/users/me', getUserProfile);
router.patch('/users/me', userPatchProfileValidate, changeProfile);

module.exports = router;
