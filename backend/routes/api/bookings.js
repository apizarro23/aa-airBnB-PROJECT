const express = require("express");
const {
  setTokenCookie,
  requireAuth,
  restoreUser,
} = require("../../utils/auth");
const { Image, Review, Spot, User, Booking } = require("../../db/models");
const { check, Result } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const router = express.Router();
const { Op, Sequelize } = require("sequelize");

//get all of the current user's bookings

router.get("/", requireAuth, async (req, res) => {
  const { id } = req.user;
  const bookings = await Booking.findAll({
    include: [
      {
        model: Spot,
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "price",
          "previewImage",
        ],
      },
    ],
    where: { userId: id },
  });
  res.json(bookings);
});

//get all bookings for a spot based on the spot's id

router.get("/:spotId", requireAuth, async (req, res) => {
  const { id } = req.user;
  const spotId = req.params.spotId;

  let currentBooking = await Spot.findByPk(spotId);

  if (!currentBooking) {
    res.status(404);
    res.json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  }

  if (currentBooking.ownerId !== id) {
    currentBooking = await Booking.findAll({
      where: { spotId },
      attributes: ["spotId", "startDate", "endDate"],
    });
  } else {
    currentBooking = await Booking.findAll({
      where: { spotId },
      include: { model: User },
    });
  }

  res.json(currentBooking);
});

//create a booking from a spot based on the spot's id

router.post("/:spotId", requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  bookingParams = req.body;
  bookingParams.spotId = spotId;
  bookingParams.userId = req.user.id;

  let spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found!",
    });
  }

  if (bookingParams.userId === spot.ownerId) {
    return res.status(403).json({
      message: "Forbidden",
      statusCode: 403,
    });
  }

  if (bookingParams.endDate <= bookingParams.startDate) {
    return res.status(400).json({
      message: "Validation error",
      statusCode: 400,
      errors: {
        endDate: "endDate cannot come before startDate",
      },
    });
  }

  let currentBookings = await Booking.findAll({
    where: {
      spotId: spotId,
      [Op.and]: [
        {
          startDate: {
            [Op.lte]: bookingParams.endDate,
          },
        },
        {
          endDate: {
            [Op.gte]: bookingParams.startDate,
          },
        },
      ],
    },
  });

  if (currentBookings.length) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      statusCode: 403,
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      },
    });
  }

  let booking = await Booking.create(bookingParams);
  booking = await Booking.findByPk(booking.id);
  return res.json(booking);
});

// delete a booking

router.delete("/:bookingId", requireAuth, async (req, res) => {
  let bookingId = req.params.bookingId;
  let currentUserId = req.user.id;

  let currentBooking = await Booking.findByPk(bookingId);
  if (!currentBooking) {
    res.status(404);
    res.json({
      message: "Spot does not exist",
    });
  }

  let spot = await Spot.findByPk(currentBooking.spotId);
  if (
    currentBooking.userId !== currentUserId &&
    spot.ownerId !== currentUserId
  ) {
    res.status(403);
    res.json({
      message: "Forbidden",
      statusCode: 403,
    });
  }

  if (currentBooking.startDate < Date.now()) {
    res.status(400);
    res.json({
      message: "You cannot delete a past or current booking",
      statusCode: 400,
    });
  }

  await currentBooking.destroy({
    where: {
      id: bookingId,
    },
  });

  return res.json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});

//Edit a Booking
router.put("/:bookingId", requireAuth, async (req, res) => {
  let bookingId = req.params.bookingId;
  let bookingParams = req.body;
  let currentUserId = req.user.id;

  let booking = await Booking.findByPk(bookingId);

  if (!booking) {
    return res.status(404).json({
      message: "Spot does not exist",
    });
  }

  if (booking.userId !== currentUserId) {
    res.status(403);
    res.json({
      message: "Forbidden",
      statusCode: 403,
    });
  }

  if (booking.endDate < Date.now()) {
    return res.status(400).json({
      message: "You cannot edit a past booking",
      statusCode: 400,
    });
  }

  let currentBooking = await Booking.findAll({
    where: {
      id: {
        [Op.not]: bookingId, 
      },
      spotId: booking.spotId,
      [Op.and]: [
        {
          
          startDate: {
            [Op.lte]: bookingParams.endDate,
          },
        },
        {
          endDate: {
            [Op.gte]: bookingParams.startDate,
          },
        },
      ],
    },
  });

  if (currentBooking.length) {
    res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      statusCode: 403,
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      },
    });
  }

  booking = await Booking.update(bookingParams, {
    where: {
      id: bookingId,
    },
  });
  booking = await Booking.findByPk(bookingId);
  res.json(booking);
});

module.exports = router;
