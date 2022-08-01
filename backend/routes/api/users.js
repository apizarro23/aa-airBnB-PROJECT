const express = require("express");

const {
  setTokenCookie,
  requireAuth,
  restoreUser,
} = require("../../utils/auth");
const { Booking, Review, Spot, User } = require("../../db/models");
const sequelize = require("sequelize");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

// Sign up
router.post("/sign-up", validateSignup, async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;

  let errors = [];

  const trackEmail = await User.findOne({
    where: { email },
  });
  if (trackEmail) {
    errors.push("User with that email already exists!");
  }
  const trackUserName = await User.findOne({
    where: { username },
  });
  if (trackUserName) {
    errors.push("User with that username already exists!");
  }
  if (errors.length) {
    res.status(403).json(errors);
  }

  const user = await User.signup({
    firstName,
    lastName,
    email,
    username,
    password,
  });
  const token = await setTokenCookie(res, user);

  const newUser = {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    token: token,
  };

  res.json(newUser);
});

//Get the Current User
router.get("/currentUser", requireAuth, async (req, res) => {
  const user = {
    id: req.user.id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
  };
  return res.json(user);
});

//get all users
router.get("/", async (req, res) => {
  let users = await User.findAll();
  return res.json(users);
})

module.exports = router;
