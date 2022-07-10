const express = require("express");
const { setTokenCookie, requireAuth, restoreUser,} = require("../../utils/auth");
const { Image, Review, Spot, User, Booking, sequelize } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const router = express.Router();
const { Op, Sequelize } = require("sequelize");

// add image to a spot based on Spot's id
router.post("/spots/:spotId/addImage", requireAuth, async(req, res) => {
    let currentSpotImages = await Spot.findByPk(req.params.spotId)

    const currentSpotId = req.params.spotId;
    const id = req.user.id;

    const {url,  spotId} = req.body;


    if (!currentSpotImages) {
        return res.status(404).json({
          "message": "Spot could not be found",
          "statusCode": 404
        });
      }
    
    const newImage = await Image.create({
        url,
        imageableId: currentSpotImages.ownerId,
        imageableType: "Spot",
        spotId: req.params.spotId
    });
    
    res.json(newImage);
})

//add image to a review based on reviews id
router.post("/reviews/:reviewId/addImage", requireAuth, async(req, res) => {
    let currentReviewImages = await Review.findByPk(req.params.reviewId)

    const currentUser = req.user.id;
    const review = req.params.reviewId;

    const {url, spotId} = req.body;


    if (!currentReviewImages) {
        return res.status(404).json({
          "message": "Review could not be found",
          "statusCode": 404
        });
      }

      
      // if (review.userId !== currentUser) {
      //   res.status(403);
      //   res.json({
      //     message: "Only owners of the spot can add an image",
      //     statusCode: 403,
      //   });
      // }
    
    const allImg = await Image.findAll({
        where: {
              [Op.and]: [
                { reviewId: req.params.reviewId },
                { imageableType: "Review" },
              ],
            },
          });
        
          if (allImg.length > 10) {
            res.status(400);
            res.json({
              message: "Maximum number of images for this resource was reached",
              statusCode: 400,
            });
          }

    const newImage = await Image.create({
        url,
        reviewId: req.params.reviewId,
        spotId: req.spotId.id,
        imageableId: review.userId,
        imageableType: "Review"
    });
    
    res.json(newImage);
})

// //delete an image
router.delete("/:imageId", requireAuth, async (req, res) => {
    const image = await Image.findByPk(req.params.imageId);
    const currentUser = req.user
  
    if (!image) {
        res.status(404);
        res.json({
          message: "Image couldn't be found",
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

    image.destroy();
    image.save();
  });

module.exports = router;