const express = require("express");
const { Op, Sequelize } = require("sequelize");
const { setTokenCookie, requireAuth, restoreUser,} = require("../../utils/auth");
const { Image, Review, Spot, User, Booking, sequelize } = require("../../db/models");
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



//get all bookings by spotid
router.get('/spots/:spotId', requireAuth, async (req, res) => {
    let currentSpotBookings = await Spot.findByPk(req.params.spotId);

    const spotId = req.params.spotId

    const currentUser = req.user.id

  if (!currentSpotBookings) {
    return res.status(404).json({
      "message": "Spot could not be found",
      "statusCode": 404
    });
  }

  if(currentSpotBookings.ownerId !== currentUser) {
    currentSpotBookings = await Booking.findAll({
        where: {spotId: spotId},
        attributes: ['spotId', 'startDate', 'endDate'],
    });
  } else {
    currentSpotBookings = await Booking.findAll({
        where: {spotId: spotId},
        include: { model: User},
    })
  }


  return res.json(currentSpotBookings);
});  


//create a booking from a spot based on the spot's id

router.post("/spots/:spotId/newbooking", requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  bookingBody = req.body;
  bookingBody.spotId = spotId;
  bookingBody.userId = req.user.id;

  let spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found!",
    });
  }

  if (bookingBody.userId === spot.ownerId) {
    return res.status(403).json({
      message: "Spot must NOT belong to the current user",
      statusCode: 403,
    });
  }

  if (bookingBody.endDate <= bookingBody.startDate) {
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
            [Op.lte]: bookingBody.endDate,
          },
        },
        {
          endDate: {
            [Op.gte]: bookingBody.startDate,
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

  let booking = await Booking.create(bookingBody);
  booking = await Booking.findByPk(booking.id);
  return res.json(booking);
});


// Edit a Booking
router.put("/:bookingId", requireAuth, async (req, res) => {
  const bookingEdit = await Booking.findByPk(req.params.bookingId);

  if (!bookingEdit) {
    return res.status(404).json({
      message: "Booking couldn't be found",
      statusCode: 404,
    });
  }

  if (bookingEdit.userId !== req.user.id) {
    return res.status(401).json({
      message: "You must be the owner of this booking to edit",
      statusCode: 401,
    });
  }

  const { spotId } = bookingEdit.toJSON();
  const allBookings = await Booking.findAll({
    attributes: ["startDate", "endDate"],
    where: {
      spotId,
    },
    raw: true,
  });

  const err = {
    message: "Validation error",
    statusCode: 400,
    errors: {},
  };
  const { startDate, endDate } = req.body;

  if (bookingEdit.endDate < Date.now()) {
    return res.status(400).json({
      message: "You cannot edit a past booking",
      statusCode: 400,
    });
  }

  if (!startDate) err.errors.startDate = "Start date is required";
  if (!endDate) err.errors.endDate = "End date is required";
  if (startDate > endDate)
    err.errors.endDate = "endDate cannot come before startDate";

  if (!startDate || !endDate || endDate < startDate) {
    return res.status(400).json(err);
  }

  err.message =
    "Sorry, this property is already booked for the specified dates";
  err.statusCode = 403;
  err.errors = {};

  for (let dates of allBookings) {
    let start = dates.startDate;
    let end = dates.endDate;
    if (startDate >= start && startDate <= end) {
      err.errors.startDate = "Start date conflicts with an existing booking";
    }
    if (endDate >= start && endDate <= end) {
      err.errors.endDate = "End date conflicts with an existing booking";
    }
  }

  if ("endDate" in err.errors || "startDate" in err.errors) {
    return res.status(403).json(err);
  }

  bookingEdit.startDate = startDate;
  bookingEdit.endDate = endDate;

  await bookingEdit.save();

  res.json(bookingEdit);
});


// Delete a Booking
router.delete("/:bookingId", requireAuth, async (req, res) => {
  let bookingId = req.params.bookingId;
  let currentUserId = req.user.id;

  let currentBooking = await Booking.findByPk(bookingId);
  
  let spot = await Spot.findByPk(currentBooking.spotId);

  if (!currentBooking) {
    res.status(404);
    res.json({
      message: "Booking couldn't be found",
    });
  }

  if (
    currentBooking.userId !== currentUserId &&
    spot.ownerId !== currentUserId
  ) {
    res.status(403);
    res.json({
      message: "Only owners of the booking or property can delete this booking",
      statusCode: 403,
    });
  }

  const { startDate } = currentBooking.toJSON();

  if (new Date(startDate) < new Date()) {
    return res.status(400).json({
      message: "Bookings that have been started can't be deleted",
      statusCode: 400,
    });
  }

  await currentBooking.destroy({
    where: { id: bookingId },
  });

  return res.json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});

module.exports = router;