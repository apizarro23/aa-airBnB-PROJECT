const express = require('express');
const {requireAuth } = require('../../utils/auth');
const {Spot, Image, User, Review} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
const {Sequelize} = require('sequelize');
const sequelize = new Sequelize("sqlite::memory:");


// GET ALL SPOTS
router.get('/', async(req, res) => {
    let allSpots = await Spot.findAll()
    res.json(allSpots)
})

// // GET DETAILS FOR A SPOT FROM CURREN
// router.get('/:spotid', requireAuth, async (req, res) => {
//     const { id } = req.spot

//       const places = await Spot.findAll({
//           where: {ownerId: id}
//       });
//   res.json(places[0])
// });

  //Get details from a spot from an id
  router.get("/:spotid", async(req,res) => {
    const spotid = req.params.spotid;

    const spot = await Spot.findByPk(spotid, {
        include: [
            {model: Image, as:'images', attributes:['url']},
            {model: User, as:'Owner', attributes:['id', 'firstName', 'lastname']}
        ],
    });

    const reviewsAggData = await Spot.findByPk(req.params.spotid, {
        include: {
            model: Review,
            attributes: []
        },
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('*')), 'numReviews'],
            [sequelize.fn('AVG', sequelize.col('stars')), 'avgStarRating']
          ],
        raw: true
    });

    const spotData = spot.toJSON()
    spotData.numReviews = reviewsAggData.numReviews
    spotData.avgStarRating = reviewsAggData.avgStarRating


    if (!spot) {
        res.status(404);
        return res.json({
          message: "Spot couldn't be found",
          statusCode: 404
        })
      };


    return res.json(spotData)
  })



module.exports = router;