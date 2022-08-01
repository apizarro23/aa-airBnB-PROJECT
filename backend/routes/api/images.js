const express = require("express");
const {
  setTokenCookie,
  requireAuth,
  restoreUser,
} = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { Image, Review, Spot, User, Booking } = require("../../db/models");
const { check, Result } = require("express-validator");
const router = express.Router();
const { Op, Sequelize } = require("sequelize");
const image = require("../../db/models/image");

//add an image to a spot based on the Spot's id

router.post("/spots/:spotId", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    where: {
      ownerId: req.user.id,
    },
  });

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  }

  const { url } = req.body;

  const allImg = await Image.findAll({
    where: {
      [Op.and]: [{ spotId: req.params.spotId }, { imageableType: "Spot" }],
    },
  });

  const image = await Image.create({
    imageableId: allImg.length + 1,
    imageableType: "Spot",
    url,
  });

  res.json(image);
});

//Add an Image to a Review based on the Review's id
router.post("/reviews/:reviewId", requireAuth, async (req, res) => {
  const currentUserId = req.user.id;
  const reviewId = req.params.reviewId;

  let review = await Review.findByPk(reviewId);
  if (!review) {
    res.status(404);
    res.json({
      message: "Review does not exist",
    });
  }

  if (review.userId !== currentUserId) {
    res.status(403);
    res.json({
      message: "Authorization Required",
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

  const { url } = req.body;

  const image = await Image.create({
    imageableId: allImg.length + 1,
    imageableType: "Review",
    url,
  });

  res.json(image);
});

//delete an image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const currentUserId = req.user.id;
  const imageId = req.params.imageId;

  const images = await Image.findByPk(imageId);

  if (!images) {
    res.status(404);
    res.json({
      message: "Image couldn't be found",
      statusCode: 404,
    });
  }
  // if (images.imageableId !== currentUserId) {
  //   res.status(403);
  //   res.json({
  //     message: "Forbidden",
  //     statusCode: 403,
  //   });
  // }

  await images.destroy({
    where: {
      id: imageId,
    },
  });

  res.json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});

module.exports = router;
