const express = require('express');
const { Op } = require("sequelize");
const {requireAuth } = require('../../utils/auth');
const {Spot, Image, User, Review, sequelize} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();



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

// // GET ALL SPOTS
// router.get('/', async(req, res) => {
//     let allSpots = await Spot.findAll()
//     res.json(allSpots)
// })

router.get('/', async(req, res) => {
  const pagination = { filter: [] };

  let {page, size, maxLat, minLat, minLng, maxLng, minPrice, maxPrice} = req.query

  const error = {
    message: "Validation Error",
    statusCode: 400,
    errors: {}
  }

  page = Number(page);
  size = Number(size);
  if (Number.isNaN(page)) page = 0
  if (Number.isNaN(size)) size = 20

  if (page < 0) error.errors.page = "Page must be greater than or equal to 0";
  if (size < 0) error.errors.size = "Size must be greater than or equal to 0";
  if (Number(maxLat) > 90) {
    error.errors.maxLat = "Maximum latitude is invalid";
    maxLat = false;
  }


  if (Number(minLat) < -90) {
    error.errors.maxLat = "Minimum latitude is invalid";
    minLng = false;
  }
  if (Number(maxLng) > 180) {
    error.errors.maxLng = "Maximum longitude is invalid";
    maxLng = false;
  }
  if (Number(minLng) < -180) {
    error.errors.minLng = "Minimum longitude is invalid";
    minLng = false;
  }
  if (Number(minPrice) < 0) {
    error.errors.minPrice = "Maximum price must be greater than 0";
    minPrice = false;
  }
  if (Number(maxPrice) < 0) {
    error.errors.maxPrice = "Minimum price must be greater than 0";
    maxPrice = false;
  }

  if (
    page < 0 ||
    size < 0 ||
    (!maxLat && maxLat !== undefined) ||
    (!minLat && minLat !== undefined) ||
    (!maxLng && maxLng !== undefined) ||
    (!minLng && minLng !== undefined) ||
    (!minPrice && minPrice !== undefined) ||
    (!maxPrice && maxPrice !== undefined)
  ) {
    res.status(400);
    res.json(error);
  }

  if (maxLat) {
    pagination.filter.push({
      lat: { [Op.lte]: Number(maxLat) },
    });
  }
  if (minLat) {
    pagination.filter.push({
      lat: { [Op.gte]: Number(minLat) },
    });
  }
  if (minLng) {
    pagination.filter.push({
      lng: { [Op.gte]: Number(minLng) },
    });
  }
  if (maxLng) {
    pagination.filter.push({
      lng: { [Op.lte]: Number(maxLng) },
    });
  }
  if (minPrice) {
    pagination.filter.push({
      price: { [Op.gte]: Number(minPrice) },
    });
  }
  if (maxPrice) {
    pagination.filter.push({
      price: { [Op.lte]: Number(maxPrice) },
    });
  }

  pagination.size = size;
  pagination.page = page;

  const allSpots = await Spot.findAll({
    where: {
      [Op.and]: pagination.filter,
    },
    limit: pagination.size,
    offset: pagination.size * pagination.page,
  });
  res.json({
    allSpots,
    page: pagination.page,
    size: pagination.size,
  });


})


  //Get details from a spot from an id
  
  router.get("/:spotid", async(req,res) => {
    const spotid = req.params.spotid;

    const spot = await Spot.findByPk(spotid, {
        include: [
            {model: Image, as:'images', attributes:['url']},
            {model: User, as:'Owner', attributes:['id', 'firstName', 'lastName']}
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

    const { id } = req.user


    if (!spotToEdit) {
        res.status(404);
        return res.json({
          message: "Spot couldn't be found",
          statusCode: 404
        })
      };
    
    if(spotToEdit.ownerId !== req.user.id) {
      res.status(403)
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

    return res.json(spotToEdit)
  })


// Delete a Spot

router.delete("/:spotid", requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotid);
  
    if (!spot) {
      res.status(404);
      res.json({
        message: "Property couldn't be found",
        statusCode: 404,
      });
    }

    if(spot.ownerId !== req.user.id) {
      res.status(403)
      res.json({message: "You must be the owner to edit this spot"})
    }  
  
    res.json({
      message: "Successfully deleted",
      statusCode: 200,
    });
  
    spot.destroy();
    spot.save();
  });


module.exports = router;