const express = require("express");
const { setTokenCookie, requireAuth, restoreUser,} = require("../../utils/auth");
const { Image, Review, Spot, User, sequelize } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const router = express.Router();

const validateBooking = [
    check('review')
     .exists({ checkFalsy: true })
     .withMessage('Review text is required'),
    check('stars')
      .isLength({ min: 1, max: 5 })
      .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
  ];



module.exports = router;