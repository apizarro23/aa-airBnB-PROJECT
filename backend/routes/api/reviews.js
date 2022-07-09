const express = require("express");
const { setTokenCookie, requireAuth, restoreUser,} = require("../../utils/auth");
const { Image, Review, Spot, User, sequelize } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
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
  router.post('/spots/:spotId/newreview', requireAuth, validateReview, async (req, res) => {     
    let currentSpot = await Spot.findByPk(req.params.spotId);
    const spot = req.params.spotId
    const id = req.user.id;

    const {review, stars, userId, spotId} = req.body;

  if (!currentSpot) {
    return res.status(404).json({
      "message": "Spot could not be found",
      "statusCode": 404
    });
  }

    if(currentSpot.ownerId !== id) {
        res.status(403);
        res.json({
          "message": "User already has a review for this spot",
          "statusCode": 403
        })
      }
    
    const newReview = await Review.create({
        spotId: spot,
        userId: id,
        review,
        stars,
  })

  return res.json(newReview)

  })

  // Edit Review
  router.put('/:reviewId', requireAuth, validateReview, async(req, res) => {
    const { userId, spotId, review, stars } = req.body
    const reviewEdit = await Review.findByPk(req.params.reviewId);
    const currentUser = req.user

    if (!reviewEdit) {
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