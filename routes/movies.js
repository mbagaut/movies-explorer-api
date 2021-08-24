const router = require('express').Router();
const { movieDeleteIdValidate, moviePostValidate } = require('../middlewares/validations');

const {
  getSavedMovies,
  saveMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getSavedMovies);
router.post('/movies', moviePostValidate, saveMovie);
router.delete('/movies/:movieId', movieDeleteIdValidate, deleteMovie);

module.exports = router;
