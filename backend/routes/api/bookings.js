const express = require("express");
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

// Create a booking bases on spotId
router.post('/spots/:spotId/newbooking', requireAuth, async(req, res) => {
    let currentSpot = await Spot.findByPk(req.params.spotId);
    const spot = req.params.spotId
    const id = req.user.id;

    
    if (!currentSpot) {
        return res.status(404).json({
          "message": "Spot could not be found",
          "statusCode": 404
        });
    }
    
    const {spotId, userId, startDate, endDate} = req.body

    const allDates = await Booking.findAll({
        attributes: ['startDate', 'endDate'],
        raw: true,
        where: {
          spotId: req.params.spotId
        }
      })
    
    err.message = "Sorry, this spot is already booked for the specified dates"
    err.statusCode = 403
    err.errors = {}
    for (let dates of allDates) {
        let start = dates.startDate
        let end = dates.endDate
        if ((startDate >= start && startDate <= end)) {
            err.errors.startDate = "Start date conflicts with an existing booking"
        }
        if ((endDate >= start && endDate <= end)) {
            err.errors.endDate = "End date conflicts with an existing booking"
        }
    }

    if ('endDate' in err.errors || 'startDate' in err.errors) {
        return res.status(403).json(err);
    }

    const booking = await Booking.create({
        spotId: req.params.spotId,
        userId: req.user.id,
        startDate,
        endDate
    })
    res.json(booking);
})

// Edit a Booking
router.put('./bookingId', requireAuth, async(req, res) => {
  const {spotId, userId, startDate, endDate} = req.body;


})

// Delete booking
router.delete('./bookingId', requireAuth, async(req, res) => {
  const bookingId = req.params.bookingId;
  const currentUser = req.user;

  const currentBooking = await Booking.findByPk(bookingId);
  let spot = await Spot.findByPk(currentBooking.spotId)

  if (!currentBooking) {
    res.status(404);
    res.json({
      message: "Booking couldn't be found",
    });
  }

  if (currentBooking.userId !== currentUser && spot.ownerId !== currentUser) {
    res.status(403);
    res.json({
      message: "Only owners of the booking or spot can delete this booking",
      statusCode: 403,
    })
  }

  const { startDate } = currentBooking.toJSON();

  if (new Date(startDate) < new Date()) {
    return res.status(400).json({
      message: "Bookings that have been started can't be deleted",
      statusCode: 400,
    });
  }

  res.json({
    message: "Successfully deleted",
    statusCode: 200,
  })

  await currentBooking.destroy({
    where: { id: bookingId },
  })


})

module.exports = router;