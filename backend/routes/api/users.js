// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, Image } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


  const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email'),
    check('firstName')
     .exists({ checkFalsy: true })
     .withMessage('First Name is required'),
    check('lastName')
     .exists({ checkFalsy: true })
     .withMessage('Last Name is required'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];


// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;

      const validEmail = await User.findOne({
        where: { email }
      })
      if (validEmail) {
        res.status(403);
        res.json({
          message: "User with that email already exists!"
        })
      }

      const user = await User.signup({ email, username, password, firstName, lastName });

      if (!firstName) {
        res.status(400).json({
          message: "First Name is required"
        })
      }
      if (!lastName) {
        res.status(400).json({
          message: "Last Name is required"
        })
      }
  
      await setTokenCookie(res, user);
  
      return res.json({
        user
      });
    }
  );

  //Get Current User
  router.get('/currentuser', requireAuth, async (req, res) => {
    const getCurrent = {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email
    }
    return res.json(getCurrent);
  });

  //Get all Spots owned by the Current User
  router.get("/currentuser/spots", requireAuth, async(req,res) => {
    const {id} = req.user;

    const spots = await Spot.findAll({
      where: {ownerId: id},
    });
    res.json(spots)
  });

  //Get all reviews of the current user

router.get("/currentuser/allreviews", requireAuth, async (req, res) => {
  const review = await Review.findAll({
    where: { id: req.user.id },
      include: [
        { model: User, attributes: ["id", "firstName", "lastName"] },
        { model: Spot, attributes: {
          exclude: ["description", "previewImage", "createdAt", "updatedAt"],
        }},
        { model: Image, attributes: ['url'] },
      ],
    },
  );
  
  if (!review) {
    res.status(404);
    res.json({ message: "Spot does not exist"})
  }

  res.json(review);
});

module.exports = router;