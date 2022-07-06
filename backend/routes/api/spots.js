const express = require('express');
const {requireAuth } = require('../../utils/auth');
const {Spot, Image, User} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();


// GET ALL SPOTS
router.get('/', async(req, res) => {
    let allSpots = await Spot.findAll()
    res.json(allSpots)
})

// GET DETAILS FOR A SPOT FROM AN ID
router.get('/:spotid', requireAuth, async (req, res) => {
    const { id } = req.spot

      const places = await Spot.findAll({
          where: {ownerId: id}
      });
  res.json(places[0])
});



module.exports = router;