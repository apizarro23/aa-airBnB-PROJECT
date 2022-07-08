const express = require("express");
const { setTokenCookie, requireAuth, restoreUser,} = require("../../utils/auth");
const { Image, Review, Spot, User, Booking, sequelize } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const router = express.Router();

// add image to a spot based on Spot's id
router.post("/spots/:spotId/addImage", requireAuth, async(req, res) => {
    let currentSpotImages = await Spot.findByPk(req.params.spotId)

    const currentSpotId = req.params.spotId;
    const id = req.user.id;

    const {url, reviewId, spotId} = req.body;


    if (!currentSpotImages) {
        return res.status(404).json({
          "message": "Spot could not be found",
          "statusCode": 404
        });
      }
    
    const newImage = await Image.create({
        url,
        imageableId: spotId.ownerId,
        imageableType: "Spot",
    });
    
    res.json(newImage);
})

module.exports = router;