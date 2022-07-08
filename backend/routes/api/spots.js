const express = require('express');
const {requireAuth } = require('../../utils/auth');
const {Spot, Image, User, Review, sequelize} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
// const {Sequelize} = require('sequelize');
// const sequelize = new Sequelize("sqlite::memory:");


const validateSpot = [
    check("address")
      .exists({ checkFalsy: true })
      .withMessage("Street address is required"),
    check("city").exists({ checkFalsy: true }).withMessage("City is required"),
    check("state").exists({ checkFalsy: true }).withMessage("State is required"),
    check("country")
      .exists({ checkFalsy: true })
      .withMessage("Country is required"),
    check("lat")
      .exists({ checkFalsy: true })
      .withMessage("Latitude is not valid"),
    check("lng")
      .exists({ checkFalsy: true })
      .withMessage("Longitude is not valid"),
    check("name")
      .exists({ checkFalsy: true })
      .isLength({ max: 50 })
      .withMessage("Name must be less than 50 characters"),
    check("description")
      .exists({ checkFalsy: true })
      .withMessage("Description is required"),
    check("price")
      .exists({ checkFalsy: true })
      .withMessage("Price per day is required"),
    handleValidationErrors,
  ];

// GET ALL SPOTS
router.get('/', async(req, res) => {
    let allSpots = await Spot.findAll()
    res.json(allSpots)
})


  //Get details from a spot from an id
  router.get("/:spotid", async(req,res) => {
    const spotid = req.params.spotid;

    const spot = await Spot.findByPk(spotid, {
        include: [
            {model: Image, as:'images', attributes:['url']},
            {model: User, as:'Owner', attributes:['id', 'firstName', 'lastname']}
        ],
    });

    if (!spot) {
        res.status(404);
        return res.json({
          message: "Spot couldn't be found",
          statusCode: 404
        })
      };

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



    return res.json(spotData)
  })

  // Create a Spot
  router.post("/new", requireAuth, validateSpot, async(req, res) => {
    const {address, city, state, country, lat, lng, name, description, price, ownerId} = req.body

    const { id }= req.user

    const newSpot = await Spot.create({ownerId: id, address, city, state, country, lat, lng, name, description, price})

    return res.json((201),newSpot)


  })


  // Edit a spot
  router.put('/:spotid', requireAuth, validateSpot, async(req, res) => {
    const {address, city, state, country, lat, lng, name, description, price, ownerId} = req.body

    const spotToEdit = await Spot.findByPk(req.params.spotid)

    const { id }= req.user


    if (!spotToEdit) {
        res.status(404);
        return res.json({
          message: "Spot couldn't be found",
          statusCode: 404
        })
      };

    if(spotToEdit !== req.user) {
        res.status(401)
        res.json({message: "You must be the owner to edit this spot"})
    }  

    spotToEdit.address = address;
    spotToEdit.city = city;
    spotToEdit.state = state;
    spotToEdit.country = country;
    spotToEdit.lat = lat;
    spotToEdit.lng = lng;
    spotToEdit.name = name;
    spotToEdit.description = description;
    spotToEdit.price = price;

    await spotToEdit.save({ownerId: id, address, city, state, country, lat, lng, name, description, price});

    // const spotToEdit = await Spot.create({ownerId: id, address, city, state, country, lat, lng, name, description, price})

    return res.json(spotToEdit)
  })


// Delete a Property

router.delete("/:spotid", requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotid);
  
    if (!spot) {
      res.status(404);
      res.json({
        message: "Property couldn't be found",
        statusCode: 404,
      });
    }

    if(spot !== req.user) {
        res.status(401)
        res.json({message: "You must be the owner to delete this spot"})
    }  
  
    res.json({
      message: "Successfully deleted",
      statusCode: 200,
    });
  
    spot.destroy();
    spot.save();
  });


module.exports = router;