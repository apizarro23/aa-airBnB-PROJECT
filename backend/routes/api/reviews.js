const express = require("express");
const { setTokenCookie, requireAuth, restoreUser,} = require("../../utils/auth");
const { Image, Review, Spot, User, sequelize } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");
const router = express.Router();

const validateReview = [
    check('review')
     .exists({ checkFalsy: true })
     .withMessage('Review text is required'),
    check('stars')
      .isLength({ min: 1, max: 5 })
      .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
  ];

//get all reviews by spotid
router.get('/spots/:spotId', async (req, res) => {
      let currentSpotReviews = await Spot.findByPk(req.params.spotId);

      const spotId = req.params.spotId
  
    if (!currentSpotReviews) {
      return res.status(404).json({
        "message": "Spot could not be found",
        "statusCode": 404
      });
    }
  
    let currentReviews = await Review.findAll({
      where: {spotId: spotId,},
        include: [
            { model: User, attributes: ["id", "firstName", "lastName"] },
            { model: Image, attributes: ['url'] }
          ],
      },
    );
  
    return res.json(currentReviews);
  });


  //create a review for a spot based on spotid
  router.post('/spots/:spotId/newreview', requireAuth, async (req, res) => {     
    let currentSpot = await Spot.findByPk(req.params.spotId);
    const {review, stars, userId, spotId} = req.body;

    const err = {
      message: "Validation error",
      statusCode: 400,
      errors: {},
    };


  if (!currentSpot) {
    return res.status(404).json({
      "message": "Spot could not be found",
      "statusCode": 404
    });
  }
    
  const ownerHasReview = await Review.findAll({
    where: {
      [Op.and]: [
        {spotId: req.params.spotId},
        {userId: req.user.id}
      ],
    },
  })

  if(ownerHasReview.length >= 1) {
    return res.status(403).json({
      message: "User already has a review for this spot",
      statusCode: 403,
    })
  }

  if (!review) err.errors.review = "Review text is required";
  if (stars < 1 || stars > 5)
      err.errors.stars = "Stars must be an integer from 1 to 5";
  if (!review || !stars) {
      return res.status(400).json(err);
    }
    
  const newReview = await Review.create({
      spotId: req.params.spotId,
      userId: req.user.id,
      review,
      stars,
  })

  return res.json(newReview)

  })

  // Edit Review
  router.put('/:reviewId', requireAuth, async(req, res) => {
    const { userId, spotId, review, stars } = req.body
    const reviewEdit = await Review.findByPk(req.params.reviewId);
    const currentUser = req.user.id

    const err = {
      message: "Validation error",
      statusCode: 400,
      errors: {},
    };

    if (!reviewEdit) {
        res.status(404);
        res.json({
          message: "Review couldn't be found",
          statusCode: 404,
        });
      }
    
    if(currentUser !== reviewEdit.userId) {
        res.status(401)
        res.json({message: "You must be the owner to delete this review"})
    }
    
    if (!review) err.errors.review = "Review text is required";
    if (stars < 1 || stars > 5)
        err.errors.stars = "Stars must be an integer from 1 to 5";
    if (!review || !stars) {
        return res.status(400).json(err);
      }

    reviewEdit.review = review
    reviewEdit.stars = stars

    await reviewEdit.save({userId, spotId, review, stars});

    return res.json(reviewEdit)
  })

  // Delete Review
  router.delete('/:reviewId', requireAuth, async(req, res) => {
    const review = await Review.findByPk(req.params.reviewId);
    const currentUser = req.user

    if (!review) {
        res.status(404);
        res.json({
          message: "Review couldn't be found",
          statusCode: 404,
        });
      }
    
    if(!currentUser) {
        res.status(401)
        res.json({message: "You must be the owner to delete this review"})
    } 

    res.json({
        message: "Successfully deleted",
        statusCode: 200,
      });
    
      review.destroy();
      review.save();


  })

module.exports = router;