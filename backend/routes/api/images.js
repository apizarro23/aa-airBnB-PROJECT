const express = require("express");
const { setTokenCookie, requireAuth, restoreUser,} = require("../../utils/auth");
const { Image, Review, Spot, User, Booking, sequelize } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const router = express.Router();
const { Op, Sequelize } = require("sequelize");

// add image to a spot based on Spot's id
router.post("/spots/:spotId/addImage", requireAuth, async(req, res) => {
    let currentSpotImages = await Spot.findByPk(req.params.spotId, {
      where: {
        ownerId: req.user.id,
      },
    })

    const {url, spotId} = req.body;


    if (!currentSpotImages) {
        return res.status(404).json({
          "message": "Spot could not be found",
          "statusCode": 404
        });
      }

    const allImg = await Image.findAll({
        where: {
          [Op.and]: [{ spotId: req.params.spotId }, { imageableType: "Spot" }],
        },
    });
    
    const newImage = await Image.create({
        url,
        imageableId: allImg.length + 1,
        imageableType: "Spot",
        spotId: req.params.spotId
    });
    
    res.json(newImage);
})

//add image to a review based on reviews id
router.post("/reviews/:reviewId/addImage", requireAuth, async(req, res) => {
  const {id} = req.user;
  const reviewId= req.params.reviewId;
  
  let currentReviewImages = await Review.findByPk(reviewId)


    const {url, spotId} = req.body;


    if (!currentReviewImages) {
        return res.status(404).json({
          "message": "Review could not be found",
          "statusCode": 404
        });
      }
    
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
        imageableId: allImg.length +1,
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