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

// //add image to a review based on reviews id
// router.post("/reviews/:reviewId/addImage", requireAuth, async(req, res) => {
//   const {id} = req.user;
//   const reviewId= req.params.reviewId;
  
//   let currentReviewImages = await Review.findByPk(reviewId)


//     const {url, spotId} = req.body;


//     if (!currentReviewImages) {
//         return res.status(404).json({
//           "message": "Review could not be found",
//           "statusCode": 404
//         });
//       }

      
//       if (currentReviewImages.userId !== id) {
//         res.status(403);
//         res.json({
//           message: "Only owners of the spot can add an image",
//           statusCode: 403,
//         });
//       }
    
//     const allImg = await Image.findAll({
//         where: {
//               [Op.and]: [
//                 { reviewId: req.params.reviewId },
//                 { imageableType: "Review" },
//               ],
//             },
//           });
        
//           if (allImg.length > 10) {
//             res.status(400);
//             res.json({
//               message: "Maximum number of images for this resource was reached",
//               statusCode: 400,
//             });
//           }

//     const newImage = await Image.create({
//         url,
//         reviewId: req.params.reviewId,
//         imageableId: allImg.length +1,
//         imageableType: "Review"
//     });
    
//     res.json(newImage);
// })

//Add an Image to a Review based on the Review's id
router.post("/reviews/:reviewId/addimage", requireAuth, async (req, res) => {
  const currentUserId = req.user.id;
  const reviewId = req.params.reviewId;

  let review = await Review.findByPk(reviewId);
  if (!review) {
    res.status(404);
    res.json({
      message: "Review does not exist",
    });
  }

  // if (review.userId !== currentUserId) {
  //   res.status(403);
  //   res.json({
  //     message: "Authorization Required",
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

  const { url } = req.body;

  const image = await Image.create({
    imageableId: allImg.length + 1,
    imageableType: "Review",
    url,
  });

  res.json(image);
});

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