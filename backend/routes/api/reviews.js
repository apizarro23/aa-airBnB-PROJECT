const express = require("express");
const {
  setTokenCookie,
  requireAuth,
  restoreUser,
} = require("../../utils/auth");
const { Image, Review, Spot, User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const router = express.Router();

//get all reviews
router.get("/", async (req, res) => {
  let reviews = await Review.findAll();
  return res.json(reviews);
});

//Get all reviews of the current user

router.get("/current-user-review", requireAuth, async (req, res) => {
  const {id} = req.user;

  const reviews = await Review.findAll({
    include: [
      {
        model: Spot,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'previewImage']
        }
      },
      {
        model: Image,
        attributes: ['url']
      }
    ],
    where: {
      userId: id
    }
  })
  res.json(reviews)
});

//Get all reviews by a Spot's id
router.get('/:spotId', async (req, res) => {
  const spotId = req.params.spotId;

  let spot  = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({
      "message": "Spot does not exist!"
    });
  }

  let reviews = await Review.findAll({
    where: {
      spotId: spotId,
    }
  });

  let user = await User.findByPk(spot.ownerId);
  let images = await Image.findByPk(spot.id)


  return res.json({
    reviews,
    user,
    images
  });
});




//Create a Review for a Spot based on the Spot's id

router.post('/:spotId/create', requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const id = req.user.id;
  const { review, stars } = req.body;

  const currentSpot = await Spot.findOne({
    where: { id: spotId}
  });

  if (!currentSpot) {
    res.status(404);
    res.json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }

  if (stars < 1 || stars > 5) {
    res.status(400);
    res.json({
      "message": "Validation error",
      "statusCode": 400,
      "errors": {
        "review": "Review text is required",
        "stars": "Stars must be an integer from 1 to 5",
      }
    })
  }
  if (review.length < 5) {
    res.status(400);
    res.json({
      "message": "Validation error",
      "statusCode": 400,
      "errors": {
        "review": "Review text is required",
        "stars": "Stars must be an integer from 1 to 5",
      }
    })
  }
  const currentUser = await Review.findOne({
    where: { userId: id, spotId: spotId }
  })

  if(currentUser) {
    res.status(403);
    res.json({
      "message": "User already has a review for this spot",
      "statusCode": 403
    })
  }

  const newReview = await Review.create({
    userId: id,
    spotId: spotId,
    review,
    stars,
  })

  res.json(newReview)
})

//edit a review
router.put('/:reviewId', requireAuth, async(req, res) => {
  let { stars } = req.body;
  let reviewId = req.params.reviewId;
  let reviewParams = req.body;
  let currentUserId = req.user.id
  
  if (stars < 1 || stars > 5) {
    res.status(400);
    res.json({
      "message": "Validation error",
      "statusCode": 400,
      "errors": {
        "review": "Review text is required",
        "stars": "Stars must be an integer from 1 to 5",
      }
    })
  }

  let review = await Review.findByPk(reviewId);

  if (!review) {
    res.status(404);
    res.json({
      message: "Review couldn't be found",
      statusCode: 404
    })
  }


  review = await Review.update(reviewParams, {
    where: {
      id: reviewId
    }
  });
  
  review = await Review.findByPk(reviewId);

  res.json(review)

});

//delete a review

router.delete('/:reviewId', requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const id = req.user.id

  const review = await Review.findOne({
    where: {id : reviewId}
  })

  // if (review.userId !== id ) {
  //   res.status(403);
  //   res.json({
  //     "message": "Authorization Error"
  //   })
  // }

  if (!review) {
    res.status(404);
    res.json({
      "message": "Review couldn't be found",
      "statusCode": 404
    })
  }

  await review.destroy();
  await review.save();

  res.json({
    "message": "Successfully deleted",
    "statusCode": 200 
  })
})


module.exports = router;
