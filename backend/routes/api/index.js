const router = require('express').Router();
const sessionRouter = require('./sessions.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewsRouter = require('./reviews.js');
const bookingsRouter = require('./bookings.js');
const imagesRouter = require('./images.js')
const { restoreUser } = require('../../utils/auth.js');
const { requireAuth } = require('../../utils/auth.js');
const { setTokenCookie } = require('../../utils/auth.js');
const { User, Spot } = require('../../db/models');


router.use(restoreUser);
router.use('/sessions', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/reviews', reviewsRouter);
router.use('/bookings', bookingsRouter);
router.use('/images', imagesRouter);


router.post('/test', function(req, res) {
  res.json({ requestBody: req.body });
});
// GET /api/restore-user (must be connected before any other middleware or route handlers)
router.get('/restore-user', (req, res) => {
    return res.json(req.user);
  });

router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user });
});


router.get('/require-auth', requireAuth, (req, res) => {
  return res.json(req.user);
});




module.exports = router;
