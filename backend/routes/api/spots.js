const express = require('express');
// const { User } = require('sequelize/types/query-types');
const router = express.Router();

const {Spot, Review, User} = require ('../../db/models')

// GET ALL SPOTS
router.get('/', async(req, res) => {
    let allSpots = await Spot.findAll()
    res.json({allSpots})
})

// GET DETAILS FOR A SPOT FROM AN ID
router.get('/:spotid', async(req, res) => {
    let spotDetails = await Spot.findByPk(req.params.spotid, {
        include: {mode: User, attributes: ['id', 'firstName', 'lastName']},
    })

    if (!spotDetails) {
        const err = new Error("Property couldn't be found")
        err.status = 404
        res.json({
            message: err.message,
            code: err.status
        })
    } else {
        const reviewsCount = await Review.count({
            where: {spotId: property.id}
        })
        const data = {}
        data.spotDetails = {
            id: spotDetails.id,
            address: spotDetails.address,
            city: spotDetails.city,
            state: spotDetails.state,
            country: spotDetails.country,
            lat: spotDetails.lat,
            lng: spotDetails.lng,
            name: spotDetails.name,
            description: spotDetails.description,
            price: spotDetails.price,
            createdAt: spotDetails.createdAt,
            updatedAt: spotDetails.updatedAt,

        }
        data.reviewsCount = numReviews

        res.json(data)
    }
})



module.exports = router;